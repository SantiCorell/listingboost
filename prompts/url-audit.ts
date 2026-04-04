export function buildUrlAuditSystemPrompt(): string {
  return `Eres auditor SEO senior. Combinas heurísticas on-page con SEO de intención y conversión.
Devuelves JSON válido únicamente, sin markdown. Las propuestas deben ser accionables y específicas al contenido analizado.
No prometas rankings. Evitas frases genéricas. Si faltan datos en el HTML, dilo en el summary.

Incluye siempre el bloque opcional "gscStyle" con métricas CUALITATIVAS/ESTIMADAS al estilo Search Console
(porcentajes 0-100, bandas de posición, potencial de impresiones baja/media/alta, consultas a atacar).
En "gscStyle.disclaimer" indica explícitamente que NO son datos reales de Google Search Console sino inferencias del análisis.
Sé conservador con los números: deben ser coherentes con el score heurístico y los issues detectados.`;
}

export function buildUrlAuditUserPrompt(input: {
  url: string;
  country: string;
  keywordHint?: string;
  pageType: string;
  crawlSummary: unknown;
  heuristic: {
    overallScore: number;
    scoresByCategory: Record<string, number>;
    issues: unknown[];
    quickWins: string[];
  };
}): string {
  return `URL: ${input.url}
País objetivo: ${input.country}
Keyword principal (opcional del usuario): ${input.keywordHint ?? "no indicada"}
Tipo de página (según usuario): ${input.pageType}

HEURÍSTICAS DEL CRAWLER (no las contradigas sin motivo; puedes matizar):
${JSON.stringify(input.heuristic, null, 2)}

RESUMEN ESTRUCTURADO DEL HTML (campos principales):
${JSON.stringify(input.crawlSummary, null, 2)}

TAREA:
1) Infieres la keyword principal coherente con el contenido (o alineas con la keyword del usuario si encaja).
2) Describes la intención de búsqueda (informational/commercial/transactional/navigational) con matices.
3) Propones title/meta/H1 nuevos optimizados para CTR y claridad.
4) Propones esqueleto H2/H3 breve y lógico.
5) Lista keywords secundarias realistas.
6) FAQs que cubran objeciones y long tail (3-6).
7) Brechas de contenido (contentGaps) concretas.
8) Sugerencias de conversión (CRO) básicas para ecommerce si aplica.
9) prioritizedActions: 8-12 acciones ordenadas por impacto/esfuerzo.
10) interlinkingIdeas: 5-10 ideas de enlaces internos ancla+sugerencia de destino.
11) gscStyle: objeto con estimaciones tipo panel de rendimiento (ver system): disclaimer obligatorio en ese objeto,
    healthVsSimilarPagesPercent (0-100), ctrHeadroomPercent (margen de mejora de CTR estimado 0-100),
    impressionPotential "baja"|"media"|"alta", positionBandGuess (ej. "11-20"), queriesToTarget (5-12 strings),
    technicalNotes opcional.

FORMATO DE SALIDA JSON EXACTO:
{
  "summary": string,
  "mainKeywordInference": string,
  "searchIntent": string,
  "recommendedTitle": string,
  "recommendedMetaDescription": string,
  "recommendedH1": string,
  "suggestedHeadings": { "h2": string[], "h3ByH2"?: Record<string, string[]> },
  "suggestedKeywords": string[],
  "secondaryKeywords": string[],
  "suggestedFaqs": { "question": string, "answer": string }[],
  "contentGaps": string[],
  "conversionSuggestions": string[],
  "prioritizedActions": string[],
  "interlinkingIdeas": string[],
  "gscStyle": {
    "disclaimer": string,
    "healthVsSimilarPagesPercent"?: number,
    "ctrHeadroomPercent"?: number,
    "impressionPotential"?: "baja" | "media" | "alta",
    "positionBandGuess"?: string,
    "queriesToTarget"?: string[],
    "technicalNotes"?: string
  }
}`;
}
