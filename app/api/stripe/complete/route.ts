import { auth } from "@/auth";
import { getStripe } from "@/services/stripe/client";
import { syncStripeSubscriptionToDb } from "@/lib/stripe/sync-stripe-subscription";
import { fulfillCreditsCheckoutOnce } from "@/lib/stripe/fulfill-credits-once";
import { ensureStripeCustomerRecord } from "@/lib/stripe/ensure-customer-record";
import {
  amountFromCheckoutSession,
  resolveCreditsPurchasedFromCheckoutSession,
} from "@/lib/stripe/resolve-credits-from-session";

export const runtime = "nodejs";

/**
 * Tras volver de Stripe Checkout: sincroniza suscripción o créditos aunque el webhook tarde o falle en local.
 * La sesión debe incluir {CHECKOUT_SESSION_ID} en success_url (ver /api/stripe/checkout).
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  let body: { sessionId?: string };
  try {
    body = (await req.json()) as { sessionId?: string };
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  const sessionId = body.sessionId;
  if (!sessionId || typeof sessionId !== "string" || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return new Response("sessionId inválido", { status: 400 });
  }

  const stripe = getStripe();
  const cs = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (cs.metadata?.userId !== session.user.id) {
    return new Response("Sesión no pertenece a tu cuenta", { status: 403 });
  }

  const paid =
    cs.payment_status === "paid" || cs.payment_status === "no_payment_required";
  if (!paid) {
    return Response.json({ ok: false, reason: "not_paid" }, { status: 400 });
  }

  const customerId =
    typeof cs.customer === "string" ? cs.customer : cs.customer?.id ?? null;

  if (cs.metadata?.checkoutType === "credits") {
    const credits = resolveCreditsPurchasedFromCheckoutSession(cs);
    const { amountTotalCents, currency } = amountFromCheckoutSession(cs);
    if (credits < 1) {
      return Response.json({ ok: false, reason: "no_credits_in_session" }, { status: 400 });
    }
    const { added } = await fulfillCreditsCheckoutOnce({
      checkoutSessionId: sessionId,
      userId: session.user.id,
      credits,
      amountTotalCents,
      currency,
    });
    if (customerId) {
      await ensureStripeCustomerRecord(session.user.id, customerId);
    }
    return Response.json({
      ok: true,
      credits,
      alreadyFulfilled: !added,
    });
  }

  if (cs.mode === "subscription" && typeof cs.subscription === "string") {
    await syncStripeSubscriptionToDb(stripe, cs.subscription, session.user.id, customerId);
    return Response.json({ ok: true, synced: "subscription" });
  }

  return Response.json({ ok: false, reason: "unknown_checkout" }, { status: 400 });
}
