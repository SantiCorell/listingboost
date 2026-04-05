import { createHash } from "node:crypto";
import { fetchGoogleSerpSnapshot } from "@/lib/serp/serpapi-google-snapshot";
import { fetchGoogleTrendsInterestLastPeriod } from "@/lib/serp/serpapi-google-trends-batch";
import { fetchAndParseUrl } from "@/services/url/crawler";
import { topWordFrequency } from "@/lib/seo/simple-word-frequency";
import { deepseekChatJson } from "@/services/llm/deepseek";
import {
  buildSeoGapFinderSystemPrompt,
  buildSeoGapFinderUserPrompt,
} from "@/prompts/seo-gap-finder";
import {
  seoGapLlmOutputSchema,
  type SeoGapFinderResult,
} from "@/types/seo-gap-finder";
import {
  attachTrendsFuzzy,
  fillMissingMonthlyVolumes,
} from "@/lib/seo/seo-gap-fill-metrics";

function normalizeDomainInput(domain: string | null | undefined): string | null {
  if (!domain?.trim()) return null;
  return domain
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

function toOriginUrl(domain: string): string {
  return `https://${domain.replace(/^www\./, "")}`;
}

/** Evita prompts enormes que provocan 400 en el proveedor LLM. */
function shrinkCompetitorBlocks(
  competitors: {
    url: string;
    position: number;
    title: string;
    snippet: string;
    metaTitle: string | null;
    metaDescription: string | null;
    h1: string[];
    h2: string[];
    topWords: { word: string; count: number }[];
  }[],
) {
  return competitors.map((c) => ({
    ...c,
    snippet: c.snippet.slice(0, 300),
    metaDescription: c.metaDescription ? c.metaDescription.slice(0, 220) : null,
    h2: c.h2.slice(0, 10),
    topWords: c.topWords.slice(0, 14),
  }));
}

async function crawlSafe(url: string): Promise<
  | {
      ok: true;
      url: string;
      metaTitle: string | null;
      metaDescription: string | null;
      h1: string[];
      h2: string[];
      textSample: string;
    }
  | { ok: false; url: string; error: string }
> {
  try {
    const c = await fetchAndParseUrl(url, { timeoutMs: 14_000 });
    return {
      ok: true,
      url: c.finalUrl,
      metaTitle: c.title,
      metaDescription: c.metaDescription,
      h1: c.h1.slice(0, 4),
      h2: c.h2.slice(0, 14),
      textSample: c.mainTextSample.slice(0, 12_000),
    };
  } catch (e) {
    return {
      ok: false,
      url,
      error: e instanceof Error ? e.message : "Error al rastrear",
    };
  }
}

export function seoGapCacheKey(parts: {
  keyword: string;
  domain: string | null;
  country: string;
  language: string;
}): string {
  const raw = [
    parts.keyword.trim().toLowerCase(),
    parts.domain ?? "",
    parts.country.trim().toLowerCase(),
    parts.language.trim().toLowerCase(),
  ].join("|");
  return createHash("sha256").update(raw).digest("hex");
}

export async function runSeoGapFinder(params: {
  userId: string;
  keyword: string;
  domain?: string | null;
  country?: string;
  language?: string;
}): Promise<{ ok: true; data: SeoGapFinderResult } | { ok: false; error: string }> {
  const keyword = params.keyword.trim();
  if (!keyword) {
    return { ok: false, error: "La keyword es obligatoria." };
  }

  const country = (params.country ?? "es").trim() || "es";
  const language = (params.language ?? "es").trim() || "es";
  const domainNorm = normalizeDomainInput(params.domain ?? null);

  const serp = await fetchGoogleSerpSnapshot({
    keyword,
    hl: language,
    gl: country,
  });

  if (serp.error) {
    return { ok: false, error: serp.error };
  }

  const topOrganic = serp.organic.slice(0, 10);
  const urlsToCrawl = topOrganic.slice(0, 7).map((o) => o.link);
  const crawlWarnings: string[] = [];

  const competitorBlocks: {
    url: string;
    position: number;
    title: string;
    snippet: string;
    metaTitle: string | null;
    metaDescription: string | null;
    h1: string[];
    h2: string[];
    topWords: { word: string; count: number }[];
  }[] = [];

  for (let i = 0; i < urlsToCrawl.length; i += 3) {
    const batch = urlsToCrawl.slice(i, i + 3);
    const results = await Promise.all(batch.map((u) => crawlSafe(u)));
    for (let j = 0; j < results.length; j++) {
      const r = results[j]!;
      const org = topOrganic[i + j];
      if (!org) continue;
      if (!r.ok) {
        crawlWarnings.push(`${org.link}: ${r.error}`);
        competitorBlocks.push({
          url: org.link,
          position: org.position,
          title: org.title,
          snippet: org.snippet.slice(0, 320),
          metaTitle: null,
          metaDescription: null,
          h1: [],
          h2: [],
          topWords: topWordFrequency(org.title + " " + org.snippet, 12),
        });
        continue;
      }
      competitorBlocks.push({
        url: r.url,
        position: org.position,
        title: org.title,
        snippet: org.snippet.slice(0, 320),
        metaTitle: r.metaTitle,
        metaDescription: r.metaDescription,
        h1: r.h1,
        h2: r.h2,
        topWords: topWordFrequency(r.textSample, 14),
      });
    }
  }

  let userSite:
    | {
        url: string;
        metaTitle: string | null;
        metaDescription: string | null;
        h1: string[];
        topWords: { word: string; count: number }[];
      }
    | null = null;
  let userSiteKeywordsSample: string[] | undefined;

  if (domainNorm) {
    const origin = toOriginUrl(domainNorm);
    const u = await crawlSafe(origin);
    if (u.ok) {
      userSite = {
        url: u.url,
        metaTitle: u.metaTitle,
        metaDescription: u.metaDescription,
        h1: u.h1,
        topWords: topWordFrequency(u.textSample, 20),
      };
      userSiteKeywordsSample = userSite.topWords.map((x) => x.word);
    } else {
      crawlWarnings.push(`Sitio usuario (${origin}): ${u.error}`);
    }
  }

  const userPrompt = buildSeoGapFinderUserPrompt({
    keyword,
    domain: domainNorm,
    country,
    language,
    organic: topOrganic,
    relatedSearches: serp.relatedSearches,
    peopleAlsoAsk: serp.peopleAlsoAsk,
    competitors: shrinkCompetitorBlocks(competitorBlocks),
    userSite,
  });

  const llm = await deepseekChatJson({
    userId: params.userId,
    operation: "seo_gap_finder",
    maxTokens: 6144,
    timeoutMs: 180_000,
    messages: [
      { role: "system", content: buildSeoGapFinderSystemPrompt() },
      { role: "user", content: userPrompt },
    ],
  });

  if (!llm.ok) {
    return { ok: false, error: llm.error };
  }

  const parsed = seoGapLlmOutputSchema.safeParse(llm.json);
  if (!parsed.success) {
    return { ok: false, error: "El motor devolvió un formato inesperado. Reintenta en unos minutos." };
  }

  let opportunities = fillMissingMonthlyVolumes(
    [...parsed.data.opportunities].sort((a, b) => b.score - a.score),
  );

  const trendKeywords = [...new Set(opportunities.map((o) => o.keyword.trim()).filter(Boolean))].slice(0, 25);
  const trendsMap = await fetchGoogleTrendsInterestLastPeriod({
    keywords: trendKeywords,
    hl: language,
    geo: country.toUpperCase(),
  });

  opportunities = opportunities.map((o) => {
    const nk = o.keyword.trim().toLowerCase();
    const ti = trendsMap.get(nk);
    return {
      ...o,
      trendsInterest: ti ?? o.trendsInterest,
    };
  });
  opportunities = attachTrendsFuzzy(opportunities, trendsMap);

  const trendsResolved = opportunities.filter((o) => o.trendsInterest != null).length;

  const data: SeoGapFinderResult = {
    executiveSummary: parsed.data.executiveSummary,
    opportunities,
    meta: {
      keyword,
      domain: domainNorm,
      country,
      language,
      organicCount: topOrganic.length,
      competitorsCrawled: competitorBlocks.length,
      crawlWarnings,
      userSiteKeywordsSample,
      generatedAt: new Date().toISOString(),
      trendsDataPoints: trendsResolved,
    },
  };

  return { ok: true, data };
}
