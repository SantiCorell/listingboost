export function buildQuickFixSystemPrompt(): string {
  return `Eres experto SEO on-page. Devuelves SOLO JSON válido, sin markdown.
Propón title, meta description y H1 listos para copiar, alineados con la URL y el problema detectado.
Sé concreto; no uses placeholders genéricos.`;
}

export function buildQuickFixUserPrompt(input: {
  url: string;
  issue: { category: string; message: string; fix?: string };
  crawlSummary: unknown;
}): string {
  return `URL: ${input.url}

Problema detectado (${input.issue.category}): ${input.issue.message}
${input.issue.fix ? `Sugerencia previa: ${input.issue.fix}` : ""}

Contexto crawl (extracto):
${JSON.stringify(input.crawlSummary, null, 2).slice(0, 8000)}

Salida JSON exacta:
{
  "optimizedTitle": string,
  "optimizedMetaDescription": string,
  "optimizedH1": string,
  "htmlSnippet": string,
  "notes": string
}
htmlSnippet: bloque mínimo HTML o texto listo para pegar (sin scripts).`;
}
