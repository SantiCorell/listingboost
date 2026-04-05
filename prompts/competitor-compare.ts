export function buildCompetitorSystemPrompt(): string {
  return `Eres un analista senior de SEO competitivo y copy strategy (español de España o latino neutro según el contenido).
Tu misión: comparar dos páginas del mismo nicho con máxima profundidad y tono profesional, accionable y "sin humo".

REGLAS DURAS:
- Responde SOLO con un único objeto JSON válido (UTF-8). Sin markdown fuera del JSON.
- NO inventes tráfico, rankings, CTR ni datos de Analytics/Search Console.
- SÍ puedes inferir intención de búsqueda, temas, brechas de contenido, tono, prueba social, estructura y señales E-E-A-T a partir del HTML resumido y del texto muestra.
- Cita cifras de palabras/caracteres/enlaces SOLO cuando aparezcan en el bloque "MÉTRICAS_VERIFICADAS" del mensaje de usuario; para el resto usa formulaciones cualitativas.
- Sé exhaustivo: el usuario espera un informe largo, denso y útil (no un resumen superficial).
- "missingKeywordsForA": términos o frases (1-4 palabras) que B trabaja mejor o que faltan en A; mezcla genéricos de nicho y long-tail; mínimo 18 entradas, ideal 22-28.
- "structuralGaps": huecos concretos (secciones, prueba social, datos, FAQ, comparativas, etc.); mínimo 8 ítems, ideal 10-14.
- "actionItemsForA": pasos ordenados por impacto; mínimo 12, ideal 14-18. Cada ítem debe ser específico (no "mejorar SEO").
- "tacticalPriorities": 6-8 líneas muy cortas (máx. ~140 caracteres cada una) con el orden de batalla sugerido esta semana.
- Párrafos largos permitidos en executiveSummary, deepDiveContent, siteAProfile, siteBProfile, headToHead, serpEeatInsight.`;
}

export function buildCompetitorUserPrompt(input: {
  urlA: string;
  urlB: string;
  metricsBlock: string;
  summaryA: unknown;
  summaryB: unknown;
}): string {
  return `=== URLs ===
A (usuario / tu página): ${input.urlA}
B (competidor): ${input.urlB}

=== MÉTRICAS_VERIFICADAS (obligatorio usar estas cifras al hablar de volumen; no contradecir) ===
${input.metricsBlock}

=== Resumen crawl A (JSON; incluye muestra de texto) ===
${JSON.stringify(input.summaryA, null, 2).slice(0, 14000)}

=== Resumen crawl B (JSON; incluye muestra de texto) ===
${JSON.stringify(input.summaryB, null, 2).slice(0, 14000)}

=== JSON de salida (claves exactas; todos los string en español) ===
{
  "executiveSummary": "string largo: 4-7 párrafos. Visión ejecutiva: posicionamiento de cada marca, propuesta de valor percibida, brechas de confianza, oportunidad para A. Tono consultor senior.",
  "deepDiveContent": "string muy largo: analiza volumen y extensión usando las cifras del bloque MÉTRICAS_VERIFICADAS (palabras, % diferencia si aplica, jerarquía H2/H3, enlaces internos, imágenes sin alt, JSON-LD). Explica qué implica eso para profundidad temática y cobertura de intención. Incluye un subapartado implícito sobre densidad temática vs competidor.",
  "siteAProfile": "string largo: fortalezas y debilidades de A (mensaje, pruebas, claridad, CTA, estructura, SEO on-page).",
  "siteBProfile": "string largo: idem para B; qué hace que B resulte más/menos sólido.",
  "headToHead": "string largo: comparación directa mano a mano (no repitas solo el resumen ejecutivo): dónde gana A, dónde gana B, riesgo si A no reacciona.",
  "missingKeywordsForA": ["mínimo 18 términos o frases cortas", "..."],
  "structuralGaps": ["mínimo 8 huecos detallados frente a B", "..."],
  "actionItemsForA": ["mínimo 12 acciones concretas para la web A", "..."],
  "tacticalPriorities": ["6-8 prioridades tácticas ordenadas, líneas cortas", "..."],
  "serpEeatInsight": "string largo: cómo esto puede afectar a visibilidad, confianza del usuario, señales de experiencia/autoridad según lo observable en el contenido (sin inventar premios ni cifras de negocio)."
}`;
}
