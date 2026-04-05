import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";

/** Acepta JSON guardado (versiones antiguas sin campos nuevos). */
export function parseSerpInsightOutput(json: unknown): SerpCompetitorInsightOutput {
  const o = json as Record<string, unknown>;
  const str = (k: string, fallback = ""): string =>
    typeof o[k] === "string" ? (o[k] as string) : fallback;
  const cardsRaw = Array.isArray(o.competitorCards) ? o.competitorCards : [];
  const competitorCards = cardsRaw.map((c: unknown) => {
    const x = c as Record<string, unknown>;
    return {
      url: String(x.url ?? ""),
      serpPosition: typeof x.serpPosition === "number" ? x.serpPosition : 0,
      strengthsObserved: Array.isArray(x.strengthsObserved)
        ? x.strengthsObserved.map((s) => String(s))
        : [],
      whatTheyDoBetter: String(x.whatTheyDoBetter ?? ""),
    };
  });
  const actionsRaw = Array.isArray(o.prioritizedActions) ? o.prioritizedActions : [];
  const prioritizedActions = actionsRaw.map((a: unknown) => {
    const x = a as Record<string, unknown>;
    return {
      order: typeof x.order === "number" ? x.order : 0,
      phase: String(x.phase ?? ""),
      title: String(x.title ?? ""),
      steps: Array.isArray(x.steps) ? x.steps.map((s) => String(s)) : [],
      whyItMatters: String(x.whyItMatters ?? ""),
      expectedTimeToEffect: String(x.expectedTimeToEffect ?? ""),
      effortLevel: String(x.effortLevel ?? ""),
    };
  });
  const metricsRaw = Array.isArray(o.metricsToWatch) ? o.metricsToWatch : [];
  return {
    executiveSummary: str("executiveSummary"),
    marketContext: str("marketContext"),
    howGoogleEvaluatesThisQuery:
      str("howGoogleEvaluatesThisQuery") || str("marketContext") || "— (amplía el informe regenerándolo desde Monitor.)",
    whatTopResultsDoThatYouDont:
      str("whatTopResultsDoThatYouDont") ||
      "— Revisa las tarjetas de competidores más abajo para el detalle comparativo.",
    volatilityAndRealisticTimelines:
      str("volatilityAndRealisticTimelines") ||
      "Las posiciones fluctúan; combina este informe con comprobaciones periódicas en Monitor y Search Console.",
    competitorCards,
    yourUrlDiagnosis: str("yourUrlDiagnosis"),
    prioritizedActions,
    metricsToWatch: metricsRaw.map((m) => String(m)),
    honestDisclaimer: str("honestDisclaimer"),
  };
}
