import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Historial de compras de créditos (fulfillments) para el usuario actual. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const rows = await prisma.stripeCheckoutFulfillment.findMany({
    where: { userId: session.user.id, kind: "credits" },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      checkoutSessionId: true,
      creditsAdded: true,
      amountTotalCents: true,
      currency: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    payments: rows.map((r) => ({
      checkoutSessionId: r.checkoutSessionId,
      credits: r.creditsAdded,
      amountTotalCents: r.amountTotalCents,
      currency: r.currency,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}
