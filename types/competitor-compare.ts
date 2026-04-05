/** Salida validada de `services/seo/competitor-analysis.ts` (coincide con el schema zod). */
export type CompetitorCompareOutput = {
  missingKeywordsForA: string[];
  structuralGaps: string[];
  lengthComparison: string;
  actionItemsForA: string[];
  summary: string;
};

export function isCompetitorCompareOutput(v: unknown): v is CompetitorCompareOutput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    Array.isArray(o.missingKeywordsForA) &&
    o.missingKeywordsForA.every((x) => typeof x === "string") &&
    Array.isArray(o.structuralGaps) &&
    o.structuralGaps.every((x) => typeof x === "string") &&
    typeof o.lengthComparison === "string" &&
    Array.isArray(o.actionItemsForA) &&
    o.actionItemsForA.every((x) => typeof x === "string") &&
    typeof o.summary === "string"
  );
}
