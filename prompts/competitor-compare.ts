export function buildCompetitorSystemPrompt(): string {
  return `Eres analista SEO competitivo. Comparas dos URLs del mismo nicho.
Solo JSON válido. No inventes métricas de tráfico reales; infiere solo desde HTML proporcionado.`;
}

export function buildCompetitorUserPrompt(input: {
  urlA: string;
  urlB: string;
  summaryA: unknown;
  summaryB: unknown;
}): string {
  return `URL usuario: ${input.urlA}
URL competidor: ${input.urlB}

Resumen crawl A:
${JSON.stringify(input.summaryA, null, 2).slice(0, 7000)}

Resumen crawl B:
${JSON.stringify(input.summaryB, null, 2).slice(0, 7000)}

JSON exacto:
{
  "missingKeywordsForA": string[],
  "structuralGaps": string[],
  "lengthComparison": string,
  "actionItemsForA": string[],
  "summary": string
}`;
}
