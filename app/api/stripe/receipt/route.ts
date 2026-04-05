import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isStripeSecretConfigured } from "@/lib/stripe/env";
import { getReceiptUrlForCheckoutSession } from "@/lib/stripe/checkout-receipt-url";
import { getStripe } from "@/services/stripe/client";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Devuelve la URL del recibo de Stripe para una sesión de compra de créditos del usuario.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return NextResponse.json({ error: "session_id inválido" }, { status: 400 });
  }

  const owned = await prisma.stripeCheckoutFulfillment.findFirst({
    where: { checkoutSessionId: sessionId, userId: session.user.id },
  });
  if (!owned) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  if (!isStripeSecretConfigured()) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 503 });
  }

  try {
    const stripe = getStripe();
    const receiptUrl = await getReceiptUrlForCheckoutSession(stripe, sessionId);
    if (!receiptUrl) {
      return NextResponse.json({ error: "Recibo no disponible aún" }, { status: 404 });
    }
    return NextResponse.json({ receiptUrl });
  } catch (e) {
    console.error("[stripe receipt]", e);
    return NextResponse.json({ error: "No se pudo obtener el recibo" }, { status: 502 });
  }
}
