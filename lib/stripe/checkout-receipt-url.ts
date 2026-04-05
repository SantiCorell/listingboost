import type Stripe from "stripe";

/**
 * URL del recibo oficial de Stripe (hosted) para un Checkout completado en modo payment.
 */
export async function getReceiptUrlForCheckoutSession(
  stripe: Stripe,
  sessionId: string,
): Promise<string | null> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });
  const piRef = session.payment_intent;
  if (!piRef) return null;
  const piId = typeof piRef === "string" ? piRef : piRef.id;
  const pi = await stripe.paymentIntents.retrieve(piId, {
    expand: ["latest_charge"],
  });
  const ch = pi.latest_charge;
  if (typeof ch === "object" && ch && "receipt_url" in ch) {
    const url = (ch as Stripe.Charge).receipt_url;
    if (url) return url;
  }
  const charges = await stripe.charges.list({ payment_intent: piId, limit: 1 });
  return charges.data[0]?.receipt_url ?? null;
}
