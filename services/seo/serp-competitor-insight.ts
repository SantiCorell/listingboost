import { prisma } from "@/lib/prisma";
import { fetchAndParseUrl } from "@/services/url/crawler";
import { deepseekChatJson } from "@/services/llm/deepseek";
import {
  buildSerpInsightSystemPrompt,
  buildSerpInsightUserPrompt,
} from "@/prompts/serp-competitor-insight";
import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";
import {
  fetchOrganicResultsThroughRank,
  type OrganicSerpResult,
} from "@/lib/serp/google-rank";
import { z } from "zod";

const outSchema = z.object({
  executiveSummary: z.string(),
  marketContext: z.string(),
  howGoogleEvaluatesThisQuery: z.string(),
  whatTopResultsDoThatYouDont: z.string(),
  volatilityAndRealisticTimelines: z.string(),
  competitorCards: z.array(
    z.object({
      url: z.string(),
      serpPosition: z.number(),
      strengthsObserved: z.array(z.string()),
      whatTheyDoBetter: z.string(),
    }),
  ),
  yourUrlDiagnosis: z.string(),
  prioritizedActions: z.array(
    z.object({
      order: z.number(),
      phase: z.string(),
      title: z.string(),
      steps: z.array(z.string()),
      whyItMatters: z.string(),
      expectedTimeToEffect: z.string(),
      effortLevel: z.string(),
    }),
  ),
  metricsToWatch: z.array(z.string()),
  honestDisclaimer: z.string(),
});

function normalizeHost(h: string): string {
  return h.replace(/^www\./, "").toLowerCase();
}

function crawlSummaryLite(crawl: Awaited<ReturnType<typeof fetchAndParseUrl>>) {
  return {
    finalUrl: crawl.finalUrl,
    title: crawl.title,
    metaDescription: crawl.metaDescription,
    h1: crawl.h1,
    h2: crawl.h2.slice(0, 28),
    h3: crawl.h3.slice(0, 20),
    approximateWordCount: crawl.approximateWordCount,
    charCount: crawl.charCount,
    schemaHints: crawl.schemaHints.slice(0, 10),
    mainTextSample: crawl.mainTextSample.slice(0, 9000),
  };
}

function notSelfHost(link: string, userHost: string): boolean {
  try {
    const h = normalizeHost(new URL(link).hostname);
    const want = normalizeHost(userHost);
    return h !== want && !h.endsWith(`.${want}`);
  } catch {
    return false;
  }
}

/** Elige hasta `max` URLs competidoras para crawl (encima de ti, o top SERP si no posicionas). */
export function pickCompetitorOrganicHits(
  results: OrganicSerpResult[],
  userHost: string,
  userPosition: number | null,
  max: number,
): OrganicSerpResult[] {
  const others = results.filter((r) => notSelfHost(r.link, userHost));
  if (userPosition != null && userPosition > 1) {
    return others
      .filter((r) => r.position < userPosition)
      .sort((a, b) => a.position - b.position)
      .slice(0, max);
  }
  if (userPosition === 1) {
    return others.slice(0, Math.min(3, max));
  }
  return others.slice(0, max);
}

export async function runSerpCompetitorInsight(params: {
  userId: string;
  monitoringId: string;
}): Promise<
  | {
      ok: true;
      output: SerpCompetitorInsightOutput;
      keyword: string;
      pageUrl: string;
      positionAtRun: number | null;
    }
  | { ok: false; error: string }
> {
  const m = await prisma.seoMonitoring.findFirst({
    where: { id: params.monitoringId, userId: params.userId },
  });
  if (!m) {
    return { ok: false, error: "Seguimiento no encontrado." };
  }

  let userHost: string;
  try {
    userHost = normalizeHost(new URL(m.url).hostname);
  } catch {
    return { ok: false, error: "URL del seguimiento inválida." };
  }

  const userPos = m.lastPosition;
  const throughPosition =
    userPos != null && userPos > 0 ? Math.max(userPos - 1, 1) : 10;

  const serp = await fetchOrganicResultsThroughRank({
    keyword: m.keyword,
    throughPosition,
    maxPages: Math.min(8, Math.max(2, Math.ceil(throughPosition / 10))),
  });

  if (serp.note && serp.results.length === 0) {
    return { ok: false, error: serp.note };
  }

  const targets = pickCompetitorOrganicHits(serp.results, userHost, userPos, 5);
  const serpContext = serp.results
    .filter((r) => r.position <= Math.max(throughPosition, 10))
    .slice(0, 15)
    .map((r) => ({
      position: r.position,
      link: r.link,
      title: r.title,
      snippet: r.snippet,
    }));

  let userCrawl: Awaited<ReturnType<typeof fetchAndParseUrl>>;
  try {
    userCrawl = await fetchAndParseUrl(m.url);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No se pudo analizar tu URL.",
    };
  }

  const userPageSummary = crawlSummaryLite(userCrawl);

  const competitorSummaries: {
    url: string;
    position: number;
    summary: unknown;
    crawlError?: string;
  }[] = [];

  for (const t of targets) {
    try {
      const c = await fetchAndParseUrl(t.link);
      competitorSummaries.push({
        url: t.link,
        position: t.position,
        summary: crawlSummaryLite(c),
      });
    } catch (e) {
      competitorSummaries.push({
        url: t.link,
        position: t.position,
        summary: {},
        crawlError: e instanceof Error ? e.message : "Crawl fallido",
      });
    }
  }

  if (competitorSummaries.length === 0) {
    return {
      ok: false,
      error:
        "No hay suficientes resultados orgánicos de otros dominios para comparar. Prueba otra keyword o espera a que el seguimiento tenga posición.",
    };
  }

  const llm = await deepseekChatJson({
    messages: [
      { role: "system", content: buildSerpInsightSystemPrompt() },
      {
        role: "user",
        content: buildSerpInsightUserPrompt({
          keyword: m.keyword,
          userUrl: m.url,
          userPosition: userPos,
          userPageSummary,
          serpContext,
          competitorSummaries,
        }),
      },
    ],
    userId: params.userId,
    operation: "serp_competitor_insight",
    timeoutMs: 180_000,
    maxTokens: 8192,
  });

  if (!llm.ok) {
    return { ok: false, error: llm.error };
  }

  const parsed = outSchema.safeParse(llm.json);
  if (!parsed.success) {
    return { ok: false, error: "Respuesta del modelo inválida." };
  }

  return {
    ok: true,
    output: parsed.data,
    keyword: m.keyword,
    pageUrl: m.url,
    positionAtRun: m.lastPosition,
  };
}
