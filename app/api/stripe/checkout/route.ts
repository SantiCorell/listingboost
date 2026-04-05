import { NextResponse } from "next/server";
import type { Plan } from "@prisma/client";
import { auth } from "@/auth";
import { isCommerceEnabled } from "@/lib/commerce";
import { prisma } from "@/lib/prisma";
import { isStripeSecretConfigured } from "@/lib/stripe/env";
import { getStripe } from "@/services/stripe/client";
import {
  stripePriceIdForCreditPurchase,
  stripePriceIdForSubscription,
  type SubscriptionCheckoutPlan,
} from "@/lib/stripe/plan-mapping";
import { APP_NAME } from "@/lib/constants";
import {
  creditPacksAvailableForPlan,
  getFreeCreditPack,
} from "@/lib/credit-packs";
import {
  expectedSubscriptionUnitAmountCents,
  extraCreditUnitAmountCents,
  formatEurUnitsFromCents,
  planLabel,
  totalExtraCreditsAmountCents,
} from "@/lib/plans";
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
        "Si usas sk_live_…, crea o copia los precios en el Dashboard con el interruptor «Live» y actualiza STRIPE_PRICE_ID_* en Vercel."
      );
    }
    if (typeof o.message === "string") return o.message;
  }
  return fallback;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!isCommerceEnabled()) {
    return NextResponse.json(
      { error: "Los pagos están temporalmente desactivados. Solo está disponible el plan Free." },
      { status: 403 },
    );
  }

  if (!isStripeSecretConfigured()) {
    return NextResponse.json(
      {
        error:
          "Falta STRIPE_SECRET_KEY en el servidor. En Vercel → Project → Settings → Environment Variables, añade la «Secret key» de Stripe (Developers → API keys: sk_live_… o sk_test_…). Guarda y vuelve a desplegar.",
      },
      { status: 503 },
    );
  }

  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!base) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_APP_URL no configurada (URL pública de la app, sin barra final)." },
      { status: 500 },
    );
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

  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch (e) {
    console.error("[stripe checkout] init", e);
    return NextResponse.json(
      { error: "No se pudo conectar con Stripe. Revisa STRIPE_SECRET_KEY en Vercel." },
      { status: 503 },
    );
  }

  const existing = await prisma.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (type === "credits") {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
    });

    const packId =
      typeof body.pack === "string" && body.pack.trim().length > 0
        ? body.pack.trim()
        : null;

    if (packId) {
      if (!creditPacksAvailableForPlan(user.plan)) {
        return NextResponse.json(
          { error: "Los packs con descuento solo están disponibles en el plan Free." },
          { status: 400 },
        );
      }
      const pack = getFreeCreditPack(packId);
      if (!pack) {
        return NextResponse.json({ error: "Pack de créditos no válido." }, { status: 400 });
      }

      const totalEur = formatEurUnitsFromCents(pack.totalCents);
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
              price_data: {
                currency: "eur",
                unit_amount: pack.totalCents,
                product_data: {
                  name: `${APP_NAME} · ${pack.label}`,
                  description: `${pack.credits} créditos · Plan Free · −${pack.discountPercent}% vs comprar sueltos`,
                },
              },
              quantity: 1,
            },
          ],
          custom_text: {
            submit: {
              message: `Pack ${pack.credits} créditos por ${totalEur} € (ahorro aprox. ${pack.discountPercent}% vs ${formatEurUnitsFromCents(pack.listTotalCents)} € al precio unitario). Se acreditan en ${APP_NAME} al completar el pago.`,
            },
          },
          success_url: `${base}/dashboard?credits=ok&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${base}/pricing/credits`,
          metadata: {
            userId: session.user.id,
            checkoutType: "credits",
            credits: String(pack.credits),
            creditPlan: user.plan,
            packId: pack.id,
            totalAmountCents: String(pack.totalCents),
            listAmountCents: String(pack.listTotalCents),
          },
        });
        return NextResponse.json({ url: checkoutSession.url });
      } catch (e) {
        console.error("[stripe checkout credits pack]", e);
        return NextResponse.json(
          { error: stripeHttpMessage(e, "Error al crear el pago en Stripe.") },
          { status: 502 },
        );
      }
    }

    const qtyRaw = Number(body.quantity);
    const quantity = Number.isFinite(qtyRaw)
      ? Math.min(500, Math.max(1, Math.floor(qtyRaw)))
      : 1;

    const priceId = stripePriceIdForCreditPurchase(user.plan);
    if (!priceId) {
      console.error("[stripe checkout credits] falta price id para plan", user.plan);
      return NextResponse.json(
        {
          error: `Falta el precio Stripe de créditos para ${planLabel(user.plan)}. En Vercel define el STRIPE_PRICE_ID_CREDIT_* que corresponda a tu plan (FREE / PRO / PRO_PLUS / ENTERPRISE).`,
        },
        { status: 500 },
      );
    }

    const unitCents = extraCreditUnitAmountCents(user.plan);
    try {
      const priceObj = await stripe.prices.retrieve(priceId);
      if (priceObj.unit_amount != null && priceObj.unit_amount !== unitCents) {
        console.error(
          "[stripe checkout credits] unit_amount mismatch",
          { priceId, stripeCents: priceObj.unit_amount, expectedCents: unitCents, plan: user.plan },
        );
        const freeHint =
          user.plan === "FREE"
            ? " Suele pasar si STRIPE_PRICE_ID_CREDIT_FREE en Vercel apunta a un precio antiguo de 2 € o al producto «Crédito análisis» en lugar de «Crédito extra (plan Free · 1,00 €/ud)»."
            : "";
        return NextResponse.json(
          {
            error: `El Price de Stripe (${priceObj.unit_amount} céntimos) no coincide con la app (${unitCents} céntimos) para ${planLabel(user.plan)}.${freeHint} En Stripe (modo Live), copia el Price ID correcto o ejecuta «npm run stripe:seed:write» con tu clave live y «npm run stripe:verify»; luego actualiza STRIPE_PRICE_ID_CREDIT_* en Vercel y redeploy.`,
          },
          { status: 500 },
        );
      }
    } catch (e) {
      console.error("[stripe checkout credits] retrieve price", e);
      return NextResponse.json(
        { error: stripeHttpMessage(e, "No se pudo validar el precio en Stripe.") },
        { status: 502 },
      );
    }

    try {
      const totalCents = totalExtraCreditsAmountCents(user.plan, quantity);
      const planName = planLabel(user.plan);
      const totalEur = formatEurUnitsFromCents(totalCents);
      const unitEur = formatEurUnitsFromCents(unitCents);

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
        custom_text: {
          submit: {
            message: `${quantity} crédito${quantity === 1 ? "" : "s"} × ${unitEur} € (${planName}) = ${totalEur} €. Se acreditan en ${APP_NAME} al completar el pago.`,
          },
        },
        success_url: `${base}/dashboard?credits=ok&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/pricing/credits`,
        metadata: {
          userId: session.user.id,
          checkoutType: "credits",
          credits: String(quantity),
          creditPlan: user.plan,
          unitAmountCents: String(unitCents),
          totalAmountCents: String(totalCents),
        },
      });
      return NextResponse.json({ url: checkoutSession.url });
    } catch (e) {
      console.error("[stripe checkout credits]", e);
      return NextResponse.json(
        { error: stripeHttpMessage(e, "Error al crear el pago en Stripe.") },
        { status: 502 },
      );
    }
  }

  const plan = (body.plan as SubscriptionCheckoutPlan) || "PRO";
  if (!["PRO", "PRO_PLUS", "ENTERPRISE"].includes(plan)) {
    return NextResponse.json({ error: "Plan no válido" }, { status: 400 });
  }

  const priceId = stripePriceIdForSubscription(plan);
  if (!priceId) {
    return NextResponse.json(
      { error: `Falta STRIPE_PRICE_ID_${plan} en las variables de entorno.` },
      { status: 500 },
    );
  }

  if (plan === "ENTERPRISE" && !process.env.STRIPE_PRICE_ID_ENTERPRISE?.trim()) {
    console.warn(
      "[stripe checkout] STRIPE_PRICE_ID_ENTERPRISE no definido: se usa el precio Pro+; el plan Enterprise se guarda vía metadata de la suscripción.",
    );
  }

  let price: Awaited<ReturnType<typeof stripe.prices.retrieve>>;
  try {
    price = await stripe.prices.retrieve(priceId);
  } catch {
    return NextResponse.json(
      { error: "No se pudo validar el precio en Stripe (¿test vs live?)." },
      { status: 502 },
    );
  }
  if (price.type !== "recurring") {
    return NextResponse.json(
      {
        error:
          "El precio del plan no es recurrente mensual en Stripe. Crea un Price con facturación «month» o ejecuta npm run stripe:seed:write.",
      },
      { status: 500 },
    );
  }
  if (price.recurring?.interval !== "month") {
    return NextResponse.json(
      { error: "El plan debe facturarse cada mes en Stripe (intervalo «month» en el Price)." },
      { status: 500 },
    );
  }

  const expectedSubCents = expectedSubscriptionUnitAmountCents(plan);
  if (price.unit_amount != null && price.unit_amount !== expectedSubCents) {
    console.error("[stripe checkout subscription] unit_amount mismatch", {
      priceId,
      stripeCents: price.unit_amount,
      expectedCents: expectedSubCents,
      plan,
    });
    return NextResponse.json(
      {
        error: `Configuración de Stripe desactualizada: el precio de suscripción ${planLabel(plan as Plan)} no coincide con la app (${expectedSubCents} céntimos vs ${price.unit_amount}). Ejecuta «npm run stripe:seed:write» con tu clave (test/live) y actualiza STRIPE_PRICE_ID_${plan} en Vercel.`,
      },
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
    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    console.error("[stripe checkout subscription]", e);
    return NextResponse.json(
      { error: stripeHttpMessage(e, "Error al crear la suscripción en Stripe.") },
      { status: 502 },
    );
  }
}
