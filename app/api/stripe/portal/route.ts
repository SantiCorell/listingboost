import { auth } from "@/auth";
import { isCommerceEnabled } from "@/lib/commerce";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/services/stripe/client";

export const runtime = "nodejs";

/** Portal de facturación Stripe (cancelar, tarjeta, facturas). Requiere activarlo en Dashboard → Billing → Customer portal. */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  if (!isCommerceEnabled()) {
    return new Response("Facturación no disponible: pagos desactivados temporalmente.", { status: 403 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (!base) {
    return new Response("NEXT_PUBLIC_APP_URL no configurada", { status: 500 });
  }

  const row = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      stripeCustomerId: { not: null },
    },
    orderBy: { createdAt: "desc" },
    select: { stripeCustomerId: true },
  });

  const customerId = row?.stripeCustomerId;
  if (!customerId) {
    return new Response(
      "Aún no hay cliente de Stripe asociado. Contrata un plan o compra créditos primero.",
      { status: 400 },
    );
  }

  const stripe = getStripe();
  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${base}/settings`,
    });
    return Response.json({ url: portal.url });
  } catch (e) {
    console.error("[stripe portal]", e);
    const msg =
      e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string"
        ? (e as { message: string }).message
        : "";
    if (msg.includes("No configuration provided") || msg.includes("billing portal")) {
      return new Response(
        "Activa el portal de cliente en Stripe: Dashboard → Configuración → Billing → Customer portal (modo Live o Test según tu clave).",
        { status: 502 },
      );
    }
    return new Response(msg || "No se pudo abrir el portal de facturación.", { status: 502 });
  }
}
