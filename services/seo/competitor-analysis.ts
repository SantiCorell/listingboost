import { fetchAndParseUrl } from "@/services/url/crawler";
import { deepseekChatJson } from "@/services/llm/deepseek";
import { buildCompetitorSystemPrompt, buildCompetitorUserPrompt } from "@/prompts/competitor-compare";
import { z } from "zod";

const outSchema = z.object({
  missingKeywordsForA: z.array(z.string()),
  structuralGaps: z.array(z.string()),
  lengthComparison: z.string(),
  actionItemsForA: z.array(z.string()),
  summary: z.string(),
});

function crawlSummaryFromParsed(crawl: Awaited<ReturnType<typeof fetchAndParseUrl>>) {
  return {
    finalUrl: crawl.finalUrl,
    title: crawl.title,
    metaDescription: crawl.metaDescription,
    h1: crawl.h1,
    h2: crawl.h2.slice(0, 20),
    wordCount: crawl.approximateWordCount,
    schemaHints: crawl.schemaHints,
  };
}

export async function runCompetitorAnalysis(params: {
  userId: string;
  urlA: string;
  urlB: string;
}): Promise<{ ok: true; output: z.infer<typeof outSchema> } | { ok: false; error: string }> {
  let a;
  let b;
  try {
    [a, b] = await Promise.all([fetchAndParseUrl(params.urlA), fetchAndParseUrl(params.urlB)]);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No se pudo obtener una de las URLs.",
    };
  }

  const llm = await deepseekChatJson({
    messages: [
      { role: "system", content: buildCompetitorSystemPrompt() },
      {
        role: "user",
        content: buildCompetitorUserPrompt({
          urlA: params.urlA,
          urlB: params.urlB,
          summaryA: crawlSummaryFromParsed(a),
          summaryB: crawlSummaryFromParsed(b),
        }),
      },
    ],
    userId: params.userId,
    operation: "competitor_compare",
    timeoutMs: 150_000,
  });

  if (!llm.ok) return { ok: false, error: llm.error };
  const parsed = outSchema.safeParse(llm.json);
  if (!parsed.success) return { ok: false, error: "Respuesta del modelo inválida." };
  return { ok: true, output: parsed.data };
}
