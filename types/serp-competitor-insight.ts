/** Salida validada de `runSerpCompetitorInsight` (coincide con zod en el servicio). */
export type SerpCompetitorInsightOutput = {
  executiveSummary: string;
  marketContext: string;
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
