import type { Plan } from "@prisma/client";

/** Seguimiento de posiciones + alertas (Pro y superiores). */
export function hasSeoMonitoring(plan: Plan): boolean {
  return plan === "PRO" || plan === "PRO_PLUS" || plan === "ENTERPRISE";
}

/** Comparativa competidor, generador largo bulk, automatizaciones avanzadas (Pro+ / Enterprise). */
export function hasGrowthAutomation(plan: Plan): boolean {
  return plan === "PRO_PLUS" || plan === "ENTERPRISE";
}

/** SEO Gap Finder AI (SerpAPI + crawl + oportunidades): solo Pro+ y Enterprise. */
export function hasSeoGapFinder(plan: Plan): boolean {
  return plan === "PRO_PLUS" || plan === "ENTERPRISE";
}

export function monitoringCadenceOptions(plan: Plan): { value: string; label: string }[] {
  const base = [{ value: "weekly", label: "Semanal" }];
  if (hasGrowthAutomation(plan)) {
    return [{ value: "daily", label: "Diario" }, ...base];
  }
  return base;
}
