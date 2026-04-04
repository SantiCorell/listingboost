import type { Plan } from "@prisma/client";

export type SubscriptionCheckoutPlan = "PRO" | "PRO_PLUS" | "ENTERPRISE";

export function stripePriceIdForSubscription(
  plan: SubscriptionCheckoutPlan,
): string | undefined {
  switch (plan) {
    case "PRO":
      return process.env.STRIPE_PRICE_ID_PRO;
    case "PRO_PLUS":
      return process.env.STRIPE_PRICE_ID_PRO_PLUS;
    case "ENTERPRISE":
      if (process.env.STRIPE_PRICE_ID_ENTERPRISE?.trim()) {
        return process.env.STRIPE_PRICE_ID_ENTERPRISE;
      }
      return process.env.STRIPE_PRICE_ID_PRO_PLUS;
    default:
      return undefined;
  }
}

export function planFromStripePriceId(priceId: string | undefined): Plan | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return "PRO";
  if (priceId === process.env.STRIPE_PRICE_ID_PRO_PLUS) return "PRO_PLUS";
  if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) return "ENTERPRISE";
  return null;
}

/** Precio unitario Stripe (Payment mode) por crédito extra según plan del usuario. */
export function stripePriceIdForCreditPurchase(plan: Plan): string | undefined {
  switch (plan) {
    case "FREE":
      return process.env.STRIPE_PRICE_ID_CREDIT_FREE;
    case "PRO":
      return process.env.STRIPE_PRICE_ID_CREDIT_PRO;
    case "PRO_PLUS":
      return process.env.STRIPE_PRICE_ID_CREDIT_PRO_PLUS;
    case "ENTERPRISE":
      return (
        process.env.STRIPE_PRICE_ID_CREDIT_ENTERPRISE ??
        process.env.STRIPE_PRICE_ID_CREDIT_PRO_PLUS
      );
    default:
      return undefined;
  }
}
