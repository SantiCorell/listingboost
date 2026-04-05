import type { Plan } from "@prisma/client";

/**
 * Precio unitario en céntimos (EUR) por crédito extra.
 * Debe coincidir con `unit_amount` del Price de Stripe (npm run stripe:seed:write).
 * Free: 1,00 €/ud (packs con descuento vía checkout en `lib/credit-packs.ts`). Pro/Pro+/Enterprise bajan.
 */
export const EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR: Record<Plan, number> = {
  FREE: 100,
  PRO: 70,
  PRO_PLUS: 50,
  ENTERPRISE: 50,
};

/** Formato "1,99" para UI (sin símbolo €). */
export function formatEurUnitsFromCents(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function extraCreditUnitAmountCents(plan: Plan): number {
  return EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR[plan] ?? EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR.FREE;
}

/** Total en céntimos para una compra de `quantity` créditos (1–500). */
export function totalExtraCreditsAmountCents(plan: Plan, quantity: number): number {
  const q = Math.min(500, Math.max(1, Math.floor(quantity)));
  return extraCreditUnitAmountCents(plan) * q;
}

/** Incluidos/mes por plan (calibrado para margen razonable vs coste API típico). */
export const PLAN_INCLUDED_ANALYSES: Record<Plan, number> = {
  FREE: Number(process.env.FREE_MONTHLY_ANALYSES ?? "5"),
  PRO: Number(process.env.PRO_MONTHLY_ANALYSES ?? "200"),
  PRO_PLUS: Number(process.env.PRO_PLUS_MONTHLY_ANALYSES ?? "750"),
  ENTERPRISE: Number(process.env.ENTERPRISE_MONTHLY_ANALYSES ?? "500"),
};

export function monthlyIncludedLimit(plan: Plan): number {
  return PLAN_INCLUDED_ANALYSES[plan] ?? PLAN_INCLUDED_ANALYSES.FREE;
}

/** Enterprise: sin tope de cupo mensual (no descuenta créditos incluidos ni extra en acciones habituales). */
export function hasUnlimitedMonthlyCredits(plan: Plan): boolean {
  return plan === "ENTERPRISE";
}

export function isPaidPlan(plan: Plan): boolean {
  return plan !== "FREE";
}

/** Pro+ y Enterprise: exportación PDF comparativa sin coste en créditos (Free/Pro: 1 cr). */
export function isProPlusOrHigher(plan: Plan): boolean {
  return plan === "PRO_PLUS" || plan === "ENTERPRISE";
}

/** Precio mostrado (€) por crédito extra según plan — derivado de EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR. */
export const EXTRA_CREDIT_PRICE_EUR: Record<Plan, string> = {
  FREE: formatEurUnitsFromCents(EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR.FREE),
  PRO: formatEurUnitsFromCents(EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR.PRO),
  PRO_PLUS: formatEurUnitsFromCents(EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR.PRO_PLUS),
  ENTERPRISE: formatEurUnitsFromCents(EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR.ENTERPRISE),
};

export const PLAN_PRICING_DISPLAY = {
  PRO: { euros: 29, label: "29 €/mes" },
  PRO_PLUS: { euros: 79, label: "79 €/mes" },
  /** Checkout online estándar (100 €/mes); contratos a medida vía contacto. */
  ENTERPRISE: { euros: 100, label: "100 €/mes" },
} as const;

/**
 * Importe mensual en céntimos (EUR) por suscripción — debe coincidir con `scripts/stripe-seed-catalog.cjs`
 * y con los Price IDs en Vercel (`STRIPE_PRICE_ID_PRO`, etc.).
 */
export const SUBSCRIPTION_UNIT_AMOUNT_CENTS_EUR = {
  PRO: 2900,
  PRO_PLUS: 7900,
  ENTERPRISE: 10000,
} as const;

export type SubscriptionCheckoutPlanKey = keyof typeof SUBSCRIPTION_UNIT_AMOUNT_CENTS_EUR;

/** Céntimos esperados en Stripe para el checkout de suscripción (Enterprise sin price propio usa Pro+). */
export function expectedSubscriptionUnitAmountCents(plan: SubscriptionCheckoutPlanKey): number {
  if (plan === "ENTERPRISE" && !process.env.STRIPE_PRICE_ID_ENTERPRISE?.trim()) {
    return SUBSCRIPTION_UNIT_AMOUNT_CENTS_EUR.PRO_PLUS;
  }
  return SUBSCRIPTION_UNIT_AMOUNT_CENTS_EUR[plan];
}

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
