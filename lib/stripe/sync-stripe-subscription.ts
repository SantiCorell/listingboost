import type { Plan, SubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { planFromStripePriceId } from "@/lib/stripe/plan-mapping";

/** Stripe renueva sola las suscripciones con precio `recurring`; aquí alineamos BD tras cada evento. */
export function stripeSubscriptionStatusToPrisma(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  switch (status) {
    case "active":
    case "paused":
      return "ACTIVE";
    case "canceled":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    case "incomplete":
    case "incomplete_expired":
      return "INCOMPLETE";
    case "unpaid":
      return "CANCELED";
    default:
      return "ACTIVE";
  }
}

/** El usuario sigue en plan de pago mientras la suscripción no esté cancelada o impagada definitiva. */
export function subscriptionGrantsPaidPlan(status: Stripe.Subscription.Status): boolean {
  return (
    status === "active" ||
    status === "trialing" ||
    status === "past_due" ||
    status === "paused"
  );
}

export async function syncStripeSubscriptionToDb(
  stripe: Stripe,
  subscriptionId: string,
  userId: string,
  customerId: string | null,
) {
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = stripeSub.items.data[0]?.price.id;
  const plan: Plan = subscriptionGrantsPaidPlan(stripeSub.status)
    ? (planFromStripePriceId(priceId) ?? "PRO")
    : "FREE";

  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });

  const prismaStatus = stripeSubscriptionStatusToPrisma(stripeSub.status);
  const periodEnd = new Date(stripeSub.current_period_end * 1000);
  const shared = {
    stripeCustomerId: customerId ?? undefined,
    stripePriceId: priceId,
    status: prismaStatus,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
  };

  const bySub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });
  if (bySub) {
    await prisma.subscription.update({
      where: { id: bySub.id },
      data: shared,
    });
    return;
  }

  if (customerId) {
    const byCust = await prisma.subscription.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (byCust?.userId === userId) {
      await prisma.subscription.update({
        where: { id: byCust.id },
        data: { ...shared, stripeSubscriptionId: subscriptionId },
      });
      return;
    }
  }

  await prisma.subscription.create({
    data: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      status: prismaStatus,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
    },
  });
}
