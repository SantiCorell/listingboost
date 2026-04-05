import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Idempotente: webhook y retorno desde Checkout no duplican créditos. */
export async function fulfillCreditsCheckoutOnce(params: {
  checkoutSessionId: string;
  userId: string;
  credits: number;
  amountTotalCents?: number | null;
  currency?: string | null;
}): Promise<{ added: boolean }> {
  const credits = Math.min(500, Math.max(0, Math.floor(params.credits)));
  if (credits < 1) return { added: false };
  try {
    await prisma.$transaction([
      prisma.stripeCheckoutFulfillment.create({
        data: {
          checkoutSessionId: params.checkoutSessionId,
          userId: params.userId,
          kind: "credits",
          creditsAdded: credits,
          amountTotalCents: params.amountTotalCents ?? null,
          currency: params.currency ?? null,
        },
      }),
      prisma.user.update({
        where: { id: params.userId },
        data: { bonusCreditsRemaining: { increment: credits } },
      }),
    ]);
    return { added: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { added: false };
    }
    throw e;
  }
}
