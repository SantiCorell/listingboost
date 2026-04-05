export function buildBlogOptimizerSystemPrompt(): string {
  return `Eres editor SEO senior. Mejoras entradas de blog: título, gancho, estructura, densidad semántica, legibilidad.
Solo JSON válido. Devuelves versión optimizada + comparación breve antes/después.`;
}

export function buildBlogOptimizerUserPrompt(rawText: string): string {
  return `Texto original del blog (puede estar incompleto):
---
${rawText.slice(0, 12000)}
---

JSON exacto:
{
  "titleBefore": string,
  "titleAfter": string,
  "introBefore": string,
  "introAfter": string,
  "fullOptimizedMarkdown": string,
  "internalLinkingIdeas": string[],
  "faqsSuggested": { "question": string, "answer": string }[],
  "checklist": string[]
}`;
}
