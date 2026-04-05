/** Métricas calculadas en servidor a partir del crawl (no vienen del LLM). */
export type CompetitorPageMetrics = {
  words: number;
  chars: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imagesTotal: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  schemaTypes: string[];
};

/**
 * Salida de `runCompetitorAnalysis`: narrativa del modelo + métricas reales.
 * Coincide con el schema zod en `services/seo/competitor-analysis.ts`.
 */
export type CompetitorCompareOutput = {
  metricsA: CompetitorPageMetrics;
  metricsB: CompetitorPageMetrics;
  /** B vs A: positivo = B tiene más palabras. null si A = 0 palabras. */
  wordDiffPctBvsA: number | null;
  executiveSummary: string;
  deepDiveContent: string;
  siteAProfile: string;
  siteBProfile: string;
  headToHead: string;
  missingKeywordsForA: string[];
  structuralGaps: string[];
  actionItemsForA: string[];
  tacticalPriorities: string[];
  serpEeatInsight: string;
};

export function isCompetitorCompareOutput(v: unknown): v is CompetitorCompareOutput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;

  const isMetrics = (m: unknown): m is CompetitorPageMetrics => {
    if (!m || typeof m !== "object") return false;
    const x = m as Record<string, unknown>;
    return (
      typeof x.words === "number" &&
      typeof x.chars === "number" &&
      typeof x.h1Count === "number" &&
      typeof x.h2Count === "number" &&
      typeof x.h3Count === "number" &&
      typeof x.imagesTotal === "number" &&
      typeof x.imagesMissingAlt === "number" &&
      typeof x.internalLinks === "number" &&
      typeof x.externalLinks === "number" &&
      Array.isArray(x.schemaTypes) &&
      x.schemaTypes.every((t) => typeof t === "string")
    );
  };

  const strArr = (a: unknown) => Array.isArray(a) && a.every((x) => typeof x === "string");

  return (
    isMetrics(o.metricsA) &&
    isMetrics(o.metricsB) &&
    (o.wordDiffPctBvsA === null || typeof o.wordDiffPctBvsA === "number") &&
    typeof o.executiveSummary === "string" &&
    typeof o.deepDiveContent === "string" &&
    typeof o.siteAProfile === "string" &&
    typeof o.siteBProfile === "string" &&
    typeof o.headToHead === "string" &&
    strArr(o.missingKeywordsForA) &&
    strArr(o.structuralGaps) &&
    strArr(o.actionItemsForA) &&
    strArr(o.tacticalPriorities) &&
    typeof o.serpEeatInsight === "string"
  );
}
