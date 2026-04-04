import type { Plan } from "@prisma/client";

/** Incluidos/mes por plan (calibrado para margen razonable vs coste API típico). */
export const PLAN_INCLUDED_ANALYSES: Record<Plan, number> = {
  FREE: Number(process.env.FREE_MONTHLY_ANALYSES ?? "5"),
  PRO: Number(process.env.PRO_MONTHLY_ANALYSES ?? "120"),
  PRO_PLUS: Number(process.env.PRO_PLUS_MONTHLY_ANALYSES ?? "280"),
  ENTERPRISE: Number(process.env.ENTERPRISE_MONTHLY_ANALYSES ?? "500"),
};

export function monthlyIncludedLimit(plan: Plan): number {
  return PLAN_INCLUDED_ANALYSES[plan] ?? PLAN_INCLUDED_ANALYSES.FREE;
}

export function isPaidPlan(plan: Plan): boolean {
  return plan !== "FREE";
}

/** Precio mostrado (€) por crédito extra según plan actual del usuario. */
export const EXTRA_CREDIT_PRICE_EUR: Record<Plan, string> = {
  FREE: "2,00",
  PRO: "0,70",
  PRO_PLUS: "0,50",
  ENTERPRISE: "0,50",
};

export const PLAN_PRICING_DISPLAY = {
  PRO: { euros: 15, label: "15 €/mes" },
  PRO_PLUS: { euros: 30, label: "30 €/mes" },
  ENTERPRISE: { euros: null as number | null, label: "A medida" },
} as const;

export function planLabel(plan: Plan): string {
  switch (plan) {
    case "FREE":
      return "Free";
    case "PRO":
      return "Pro";
    case "PRO_PLUS":
      return "Pro+";
    case "ENTERPRISE":
      return "Enterprise";
    default:
      return plan;
  }
}
