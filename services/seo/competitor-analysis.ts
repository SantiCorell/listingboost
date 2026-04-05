import type { ParsedUrlSummary } from "@/services/url/crawler";
import { fetchAndParseUrl } from "@/services/url/crawler";
import { deepseekChatJson } from "@/services/llm/deepseek";
import { buildCompetitorSystemPrompt, buildCompetitorUserPrompt } from "@/prompts/competitor-compare";
import type { CompetitorCompareOutput, CompetitorPageMetrics } from "@/types/competitor-compare";
import { z } from "zod";

const llmSchema = z.object({
  executiveSummary: z.string(),
  deepDiveContent: z.string(),
  siteAProfile: z.string(),
  siteBProfile: z.string(),
  headToHead: z.string(),
  missingKeywordsForA: z.array(z.string()),
  structuralGaps: z.array(z.string()),
  actionItemsForA: z.array(z.string()),
  tacticalPriorities: z.array(z.string()),
  serpEeatInsight: z.string(),
});

function pageMetrics(crawl: ParsedUrlSummary): CompetitorPageMetrics {
  const schemaTypes = [...new Set(crawl.schemaHints.map((h) => h.type))];
  return {
    words: crawl.approximateWordCount,
    chars: crawl.charCount,
    h1Count: crawl.h1.length,
    h2Count: crawl.h2.length,
    h3Count: crawl.h3.length,
    imagesTotal: crawl.images.length,
    imagesMissingAlt: crawl.images.filter((i) => i.missingAlt).length,
    internalLinks: crawl.linksInternal.length,
    externalLinks: crawl.linksExternal.length,
    schemaTypes,
  };
}

function wordDiffPctBvsA(wordsA: number, wordsB: number): number | null {
  if (wordsA <= 0) return null;
  return Math.round(((wordsB - wordsA) / wordsA) * 100);
}

function crawlSummaryForLlm(crawl: ParsedUrlSummary) {
  return {
    finalUrl: crawl.finalUrl,
    statusCode: crawl.statusCode,
    title: crawl.title,
    metaDescription: crawl.metaDescription,
    canonical: crawl.canonical,
    robots: crawl.robots,
    openGraph: crawl.openGraph,
    twitter: crawl.twitter,
    h1: crawl.h1,
    h2: crawl.h2.slice(0, 40),
    h3: crawl.h3.slice(0, 40),
    approximateWordCount: crawl.approximateWordCount,
    charCount: crawl.charCount,
    schemaHints: crawl.schemaHints.slice(0, 12),
    imagesSample: crawl.images.slice(0, 15).map((i) => ({
      missingAlt: i.missingAlt,
      altLen: i.alt?.length ?? 0,
    })),
    internalLinksCount: crawl.linksInternal.length,
    externalLinksCount: crawl.linksExternal.length,
    mainTextSample: crawl.mainTextSample.slice(0, 14000),
  };
}

function metricsBlock(a: ParsedUrlSummary, b: ParsedUrlSummary, hostA: string, hostB: string): string {
  const pct = wordDiffPctBvsA(a.approximateWordCount, b.approximateWordCount);
  const pctLine =
    pct == null
      ? "Diferencia porcentual de palabras (B vs A): no aplicable (A sin palabras contadas)."
      : `Diferencia porcentual de palabras (B vs A): ${pct >= 0 ? "+" : ""}${pct}% (positivo = B más extenso).`;

  return [
    `Etiquetas: A = ${hostA} | B = ${hostB}`,
    `A — palabras: ${a.approximateWordCount} | caracteres visibles: ${a.charCount}`,
    `B — palabras: ${b.approximateWordCount} | caracteres visibles: ${b.charCount}`,
    pctLine,
    `A — H1: ${a.h1.length} | H2: ${a.h2.length} | H3: ${a.h3.length}`,
    `B — H1: ${b.h1.length} | H2: ${b.h2.length} | H3: ${b.h3.length}`,
    `A — enlaces internos únicos: ${a.linksInternal.length} | externos: ${a.linksExternal.length}`,
    `B — enlaces internos únicos: ${b.linksInternal.length} | externos: ${b.linksExternal.length}`,
    `A — imágenes: ${a.images.length} | sin alt: ${a.images.filter((i) => i.missingAlt).length}`,
    `B — imágenes: ${b.images.length} | sin alt: ${b.images.filter((i) => i.missingAlt).length}`,
    `A — tipos JSON-LD detectados: ${[...new Set(a.schemaHints.map((h) => h.type))].join(", ") || "(ninguno)"}`,
    `B — tipos JSON-LD detectados: ${[...new Set(b.schemaHints.map((h) => h.type))].join(", ") || "(ninguno)"}`,
  ].join("\n");
}

export async function runCompetitorAnalysis(params: {
  userId: string;
  urlA: string;
  urlB: string;
}): Promise<{ ok: true; output: CompetitorCompareOutput } | { ok: false; error: string }> {
  let a: ParsedUrlSummary;
  let b: ParsedUrlSummary;
  try {
    [a, b] = await Promise.all([fetchAndParseUrl(params.urlA), fetchAndParseUrl(params.urlB)]);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No se pudo obtener una de las URLs.",
    };
  }

  let hostA = "A";
  let hostB = "B";
  try {
    hostA = new URL(a.finalUrl).hostname;
  } catch {
    /* ignore */
  }
  try {
    hostB = new URL(b.finalUrl).hostname;
  } catch {
    /* ignore */
  }

  const llm = await deepseekChatJson({
    messages: [
      { role: "system", content: buildCompetitorSystemPrompt() },
      {
        role: "user",
        content: buildCompetitorUserPrompt({
          urlA: params.urlA,
          urlB: params.urlB,
          metricsBlock: metricsBlock(a, b, hostA, hostB),
          summaryA: crawlSummaryForLlm(a),
          summaryB: crawlSummaryForLlm(b),
        }),
      },
    ],
    userId: params.userId,
    operation: "competitor_compare",
    timeoutMs: 180_000,
    maxTokens: 8192,
  });

  if (!llm.ok) return { ok: false, error: llm.error };
  const parsed = llmSchema.safeParse(llm.json);
  if (!parsed.success) return { ok: false, error: "Respuesta del modelo inválida." };

  const out: CompetitorCompareOutput = {
    metricsA: pageMetrics(a),
    metricsB: pageMetrics(b),
    wordDiffPctBvsA: wordDiffPctBvsA(a.approximateWordCount, b.approximateWordCount),
    ...parsed.data,
  };

  return { ok: true, output: out };
}
