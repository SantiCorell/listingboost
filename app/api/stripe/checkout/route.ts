import { auth } from "@/auth";
import { isCommerceEnabled } from "@/lib/commerce";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/services/stripe/client";
import {
  stripePriceIdForCreditPurchase,
  stripePriceIdForSubscription,
  type SubscriptionCheckoutPlan,
} from "@/lib/stripe/plan-mapping";
import { planLabel } from "@/lib/plans";
import {
  stripeCheckoutCommonParams,
  stripeCheckoutPaymentMethodTypes,
} from "@/lib/stripe/checkout-session-defaults";

function stripeHttpMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object") {
    const o = e as { code?: unknown; message?: unknown };
    if (o.code === "resource_missing") {
      return (
        "El Price ID no existe en el modo Stripe de tu clave (test vs live). " +
        "Si usas sk_live_…, crea o copia los precios en el Dashboard con el interruptor «Live» y actualiza STRIPE_PRICE_ID_* en .env."
      );
    }
    if (typeof o.message === "string") return o.message;
  }
  return fallback;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  if (!isCommerceEnabled()) {
    return new Response(
      "Los pagos están temporalmente desactivados. Solo está disponible el plan Free.",
      { status: 403 },
    );
  }

  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!base) {
    return new Response("NEXT_PUBLIC_APP_URL no configurada", { status: 500 });
  }

  let body: Record<string, unknown> = {};
  try {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      body = (await req.json()) as Record<string, unknown>;
    }
  } catch {
    /* vacío */
  }

  const type = (body.type as string) || "subscription";
  const stripe = getStripe();

  const existing = await prisma.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (type === "credits") {
    const qtyRaw = Number(body.quantity);
    const quantity = Number.isFinite(qtyRaw)
      ? Math.min(500, Math.max(1, Math.floor(qtyRaw)))
      : 1;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
    });
    const priceId = stripePriceIdForCreditPurchase(user.plan);
    if (!priceId) {
      console.error("[stripe checkout credits] falta price id para plan", user.plan);
      return new Response(
        `Falta el precio Stripe de créditos para tu plan actual (${planLabel(user.plan)}). ` +
          `En .env define el STRIPE_PRICE_ID_CREDIT_* que corresponda (FREE / PRO / PRO_PLUS / ENTERPRISE).`,
        { status: 500 },
      );
    }

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: stripeCheckoutPaymentMethodTypes,
        ...stripeCheckoutCommonParams,
        customer: existing?.stripeCustomerId ?? undefined,
        customer_email: existing?.stripeCustomerId
          ? undefined
          : (session.user.email ?? undefined),
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        success_url: `${base}/dashboard?credits=ok&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/pricing/credits`,
        metadata: {
          userId: session.user.id,
          checkoutType: "credits",
          credits: String(quantity),
          /** Tarifa aplicada: cada plan usa su Price de Stripe (ver stripePriceIdForCreditPurchase). */
          creditPlan: user.plan,
        },
      });
      return Response.json({ url: checkoutSession.url });
    } catch (e) {
      console.error("[stripe checkout credits]", e);
      return new Response(
        stripeHttpMessage(e, "Error al crear el pago en Stripe."),
        { status: 502 },
      );
    }
  }

  const plan = (body.plan as SubscriptionCheckoutPlan) || "PRO";
  if (!["PRO", "PRO_PLUS", "ENTERPRISE"].includes(plan)) {
    return new Response("Plan no válido", { status: 400 });
  }

  const priceId = stripePriceIdForSubscription(plan);
  if (!priceId) {
    return new Response(`Falta precio Stripe para ${plan}`, { status: 500 });
  }

  let price: Awaited<ReturnType<typeof stripe.prices.retrieve>>;
  try {
    price = await stripe.prices.retrieve(priceId);
  } catch {
    return new Response("No se pudo validar el precio en Stripe.", { status: 502 });
  }
  if (price.type !== "recurring") {
    return new Response(
      "El precio del plan no es recurrente. En Stripe debe ser suscripción mensual; ejecuta npm run stripe:seed:write o crea un Price con facturación mensual.",
      { status: 500 },
    );
  }
  if (price.recurring?.interval !== "month") {
    return new Response(
      "El plan debe facturarse cada mes en Stripe (intervalo «month» en el Price).",
      { status: 500 },
    );
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: stripeCheckoutPaymentMethodTypes,
      ...stripeCheckoutCommonParams,
      customer: existing?.stripeCustomerId ?? undefined,
      customer_email: existing?.stripeCustomerId
        ? undefined
        : (session.user.email ?? undefined),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/pricing`,
      metadata: {
        userId: session.user.id,
        checkoutType: "subscription",
        targetPlan: plan,
      },
      subscription_data: {
        metadata: { userId: session.user.id, targetPlan: plan },
      },
    });
    return Response.json({ url: checkoutSession.url });
  } catch (e) {
    console.error("[stripe checkout subscription]", e);
    return new Response(
      stripeHttpMessage(e, "Error al crear la suscripción en Stripe."),
      { status: 502 },
    );
  }
}
