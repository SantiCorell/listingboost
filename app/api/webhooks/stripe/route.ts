import { headers } from "next/headers";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/services/stripe/client";
import { syncStripeSubscriptionToDb } from "@/lib/stripe/sync-stripe-subscription";
import { fulfillCreditsCheckoutOnce } from "@/lib/stripe/fulfill-credits-once";
import { ensureStripeCustomerRecord } from "@/lib/stripe/ensure-customer-record";

export const runtime = "nodejs";

async function resolveUserIdForSubscription(
  sub: Stripe.Subscription,
): Promise<string | undefined> {
  const fromMeta = sub.metadata?.userId;
  if (fromMeta) return fromMeta;
  const custId = typeof sub.customer === "string" ? sub.customer : null;
  if (custId) {
    const row = await prisma.subscription.findFirst({
      where: { stripeCustomerId: custId },
      select: { userId: true },
    });
    return row?.userId ?? undefined;
  }
  return undefined;
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response(
      "STRIPE_WEBHOOK_SECRET no configurada. En local: stripe listen --forward-to localhost:3000/api/webhooks/stripe y pega el whsec_ en .env.local",
      { status: 500 },
    );
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return new Response("Sin firma", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response("Firma inválida", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = s.metadata?.userId;
      if (!userId) break;

      if (s.metadata?.checkoutType === "credits") {
        let credits = parseInt(s.metadata.credits ?? "0", 10);
        try {
          const expanded = await stripe.checkout.sessions.retrieve(s.id, {
            expand: ["line_items"],
          });
          const q = expanded.line_items?.data[0]?.quantity;
          if (typeof q === "number" && q >= 1) {
            credits = Math.min(500, q);
          }
        } catch (e) {
          console.error("[stripe webhook] credits line_items", e);
        }
        if (credits > 0) {
          await fulfillCreditsCheckoutOnce({
            checkoutSessionId: s.id,
            userId,
            credits,
          });
        }
        const custId =
          typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
        if (custId) {
          await ensureStripeCustomerRecord(userId, custId);
        }
        break;
      }

      if (s.mode === "subscription" && s.subscription && typeof s.subscription === "string") {
        const cust =
          typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
        await syncStripeSubscriptionToDb(stripe, s.subscription, userId, cust);
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await resolveUserIdForSubscription(sub);
      if (userId && sub.id) {
        const cust =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
        await syncStripeSubscriptionToDb(stripe, sub.id, userId, cust);
      }
      break;
    }
    /** Cada cobro mensual exitoso: renueva periodo en Stripe; sincronizamos `currentPeriodEnd` en BD. */
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      const subId =
        typeof inv.subscription === "string"
          ? inv.subscription
          : inv.subscription?.id ?? null;
      if (!subId) break;
      const br = inv.billing_reason;
      if (
        br !== "subscription_cycle" &&
        br !== "subscription_create" &&
        br !== "subscription_update"
      ) {
        break;
      }
      const row = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subId },
        select: { userId: true },
      });
      if (!row) break;
      const cust =
        typeof inv.customer === "string" ? inv.customer : inv.customer?.id ?? null;
      await syncStripeSubscriptionToDb(stripe, subId, row.userId, cust);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      let userId: string | undefined = sub.metadata?.userId;
      if (!userId) {
        const row = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: sub.id },
          select: { userId: true },
        });
        userId = row?.userId ?? undefined;
      }
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: "FREE" },
        });
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "CANCELED" },
        });
      }
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
