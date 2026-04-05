/** Salida de `services/seo/blog-optimizer.ts`. */
export type BlogOptimizerOutput = {
  titleBefore: string;
  titleAfter: string;
  introBefore: string;
  introAfter: string;
  fullOptimizedMarkdown: string;
  internalLinkingIdeas: string[];
  faqsSuggested: Array<{ question: string; answer: string }>;
  checklist: string[];
};

export function isBlogOptimizerOutput(v: unknown): v is BlogOptimizerOutput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (
    typeof o.titleBefore !== "string" ||
    typeof o.titleAfter !== "string" ||
    typeof o.introBefore !== "string" ||
    typeof o.introAfter !== "string" ||
    typeof o.fullOptimizedMarkdown !== "string" ||
    !Array.isArray(o.internalLinkingIdeas) ||
    !Array.isArray(o.faqsSuggested) ||
    !Array.isArray(o.checklist)
  ) {
    return false;
  }
  if (!o.internalLinkingIdeas.every((x: unknown) => typeof x === "string")) return false;
  if (!o.checklist.every((x: unknown) => typeof x === "string")) return false;
  for (const f of o.faqsSuggested) {
    if (!f || typeof f !== "object") return false;
    const q = f as Record<string, unknown>;
    if (typeof q.question !== "string" || typeof q.answer !== "string") return false;
  }
  return true;
}
