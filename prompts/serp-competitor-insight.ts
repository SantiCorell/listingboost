export function buildSerpInsightSystemPrompt(): string {
  return `Eres consultor senior de SEO técnico y de contenidos (español). Trabajas con datos de SERP (títulos, snippets, posiciones) y resúmenes on-page de HTML público.
REGLAS:
- Responde SOLO con JSON UTF-8 válido, sin markdown.
- No inventes tráfico, enlaces externos reales ni premios. Puedes inferir hipótesis desde títulos, meta, H1/H2, extensión y estructura observada en los resúmenes.
- Sé directo, accionable y profesional: plan por fases con tiempos orientativos (días/semanas/meses) sin prometer posiciones garantizadas.
- Si faltan datos de un competidor (crawl falló), dilo en competitorCards con fortalezas vacías o texto breve.
- prioritizedActions: mínimo 8 ítems ordenados por impacto/urgencia; incluye fases inmediato (0-2 semanas), corto plazo (1-2 meses), medio plazo (3-6 meses) cuando aplique.
- howGoogleEvaluatesThisQuery: explica de forma didáctica cómo Google suele interpretar ESTA consulta concreta (intención, tipo de resultados que tiende a mostrar, señales on-page/SERP observables). NO cites fechas ni nombres de actualizaciones de algoritmo a menos que sean hechos verificables genéricos (p. ej. "Google prioriza contenido útil y experiencia"); evita rumores.
- whatTopResultsDoThatYouDont: contraste explícito "ellos (por encima de ti) vs tú": bullet points o párrafos con patrones observados (profundidad, formato, titulares, prueba social en snippet, tipo de dominio, etc.).
- volatilityAndRealisticTimelines: volatilidad típica de SERP en este tipo de query, por qué un solo snapshot no basta, y expectativas realistas de mejora con trabajo continuo.`;
}

export function buildSerpInsightUserPrompt(input: {
  keyword: string;
  userUrl: string;
  userPosition: number | null;
  userPageSummary: unknown;
  serpContext: { position: number; link: string; title?: string; snippet?: string }[];
  competitorSummaries: { url: string; position: number; summary: unknown; crawlError?: string }[];
}): string {
  return `=== Consulta Google ===
${input.keyword}

=== Tu URL y posición ===
URL: ${input.userUrl}
Posición orgánica aproximada en esta consulta: ${input.userPosition == null ? "no aparece en el tramo analizado de SERP" : String(input.userPosition)}

=== Resumen crawl tu página (JSON) ===
${JSON.stringify(input.userPageSummary, null, 2).slice(0, 12000)}

=== Top resultados orgánicos considerados (título + snippet SerpAPI) ===
${JSON.stringify(input.serpContext, null, 2).slice(0, 8000)}

=== Competidores analizados en profundidad (crawl) ===
${JSON.stringify(input.competitorSummaries, null, 2).slice(0, 16000)}

=== JSON de salida (claves exactas) ===
{
  "executiveSummary": "string largo: situación, oportunidad y tono ejecutivo.",
  "marketContext": "string: intención de búsqueda y qué busca el usuario en Google para esta query.",
  "howGoogleEvaluatesThisQuery": "string largo: marco realista (intención, tipos de resultado, señales que suelen importar) sin inventar actualizaciones con fechas.",
  "whatTopResultsDoThatYouDont": "string largo: contraste claro entre URLs por encima y la página del usuario; usa viñetas si ayuda.",
  "volatilityAndRealisticTimelines": "string: volatilidad, iteración, qué esperar en semanas vs meses.",
  "competitorCards": [
    {
      "url": "string",
      "serpPosition": number,
      "strengthsObserved": ["señales on-page/SERP que explican ventaja percibida"],
      "whatTheyDoBetter": "string: síntesis en 2-4 frases"
    }
  ],
  "yourUrlDiagnosis": "string largo: fortalezas y debilidades de tu URL vs el grupo.",
  "prioritizedActions": [
    {
      "order": 1,
      "phase": "inmediato | corto_plazo | medio_plazo",
      "title": "string corto",
      "steps": ["paso concreto 1", "paso 2"],
      "whyItMatters": "string",
      "expectedTimeToEffect": "string ej. 2-4 semanas para señal inicial; 2-4 meses para consolidar",
      "effortLevel": "bajo | medio | alto"
    }
  ],
  "metricsToWatch": ["qué monitorizar en Search Console o en vuestro tracking"],
  "honestDisclaimer": "string: límites del análisis (SERP variable, un solo snapshot, no garantías de ranking)."
}`;
}
