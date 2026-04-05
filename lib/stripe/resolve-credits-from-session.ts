import type Stripe from "stripe";

/**
 * Créditos comprados en un Checkout de tipo "credits".
 * Usa el máximo entre metadata (lo que enviamos nosotros) y la suma de cantidades en line_items,
 * porque en algunos casos Stripe devuelve quantity=1 en line_items aunque el pago sea por varias unidades.
 */
export function resolveCreditsPurchasedFromCheckoutSession(
  session: Stripe.Checkout.Session,
): number {
  const metaRaw = parseInt(session.metadata?.credits ?? "0", 10);
  const fromMeta = Number.isFinite(metaRaw) && metaRaw >= 0 ? metaRaw : 0;
  const lines = session.line_items?.data ?? [];
  let fromLines = 0;
  for (const li of lines) {
    const q = li.quantity;
    if (typeof q === "number" && q > 0) fromLines += q;
  }
  const n = Math.max(fromMeta, fromLines);
  if (n < 1) return 0;
  return Math.min(500, n);
}

export function amountFromCheckoutSession(session: Stripe.Checkout.Session): {
  amountTotalCents: number | null;
  currency: string | null;
} {
  const total = session.amount_total;
  const cur = session.currency;
  return {
    amountTotalCents: typeof total === "number" && total >= 0 ? total : null,
    currency: typeof cur === "string" && cur.length > 0 ? cur.toLowerCase() : null,
  };
}
