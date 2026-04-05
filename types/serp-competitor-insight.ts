/** Salida validada de `runSerpCompetitorInsight` (coincide con zod en el servicio). */
export type SerpCompetitorInsightOutput = {
  executiveSummary: string;
  marketContext: string;
  /** Cómo Google suele interpretar esta consulta y qué señales pesan (sin inventar fechas de algoritmos). */
  howGoogleEvaluatesThisQuery: string;
  /** Lista o texto: qué tienen los resultados por encima y tú aún no (on-page, intención, formato). */
  whatTopResultsDoThatYouDont: string;
  /** Volatilidad SERP, expectativas realistas, qué implica “trabajo continuo”. */
  volatilityAndRealisticTimelines: string;
  competitorCards: {
    url: string;
    serpPosition: number;
    strengthsObserved: string[];
    whatTheyDoBetter: string;
  }[];
  yourUrlDiagnosis: string;
  prioritizedActions: {
    order: number;
    phase: string;
    title: string;
    steps: string[];
    whyItMatters: string;
    expectedTimeToEffect: string;
    effortLevel: string;
  }[];
  metricsToWatch: string[];
  honestDisclaimer: string;
};
