import { prisma } from "@/lib/prisma";

/** Guarda el Stripe Customer en BD para reutilizar Checkout y abrir el portal (incluso si solo compró créditos). */
export async function ensureStripeCustomerRecord(
  userId: string,
  stripeCustomerId: string,
): Promise<void> {
  await prisma.subscription.upsert({
    where: { stripeCustomerId },
    create: {
      userId,
      stripeCustomerId,
      status: "ACTIVE",
    },
    update: {
      userId,
    },
  });
}
