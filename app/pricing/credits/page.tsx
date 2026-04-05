import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isCommerceEnabled } from "@/lib/commerce";
import { EXTRA_CREDIT_PRICE_EUR, extraCreditUnitAmountCents, planLabel } from "@/lib/plans";
import type { Plan } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { BuyCreditsButton } from "@/components/pricing/buy-credits-button";
import { Button } from "@/components/ui/button";
import { CREDIT_COST_PRODUCT, CREDIT_COST_URL_AUDIT } from "@/lib/usage";
import { ArrowLeft, Coins, Sparkles, Zap } from "lucide-react";
import { CreditsPaymentHistory } from "@/components/credits/credits-payment-history";
import { InvoiceRequestForm } from "@/components/credits/invoice-request-form";

export const metadata = {
  title: "Comprar créditos extra",
  robots: { index: false, follow: false },
};

export default async function BuyCreditsPage({
  searchParams,
}: {
  searchParams: Promise<{ qty?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/pricing/credits");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const commerceEnabled = isCommerceEnabled();

  const sp = await searchParams;
  const qtyRaw = Number(sp.qty);
  const initialQty =
    Number.isFinite(qtyRaw) ? Math.min(500, Math.max(1, Math.floor(qtyRaw))) : undefined;

  const planName = planLabel(user.plan);
  const allPlans: Plan[] = ["FREE", "PRO", "PRO_PLUS", "ENTERPRISE"];
  const eurPerCredit = parseFloat(EXTRA_CREDIT_PRICE_EUR[user.plan].replace(",", ".")) || 0;
  const scanUrlEur = (eurPerCredit * CREDIT_COST_URL_AUDIT).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

      <Button variant="ghost" size="sm" asChild className="relative mb-8 gap-1">
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>
      </Button>

      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.14] via-card to-violet-500/[0.08] p-6 shadow-xl shadow-primary/10 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-background/80 shadow-inner">
            <Coins className="h-6 w-6 text-primary" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Recarga de créditos</h1>
            <p className="text-sm text-muted-foreground">
              {commerceEnabled
                ? "Pago seguro con Stripe · al instante en tu cuenta"
                : "La compra con tarjeta estará disponible en cuanto activemos pagos."}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge className="bg-background/80 text-sm font-semibold shadow-sm">Plan {planName}</Badge>
          <Badge variant="secondary" className="gap-1 font-mono text-xs">
            <Zap className="h-3 w-3" />
            Tu tarifa: {EXTRA_CREDIT_PRICE_EUR[user.plan]} €/crédito
          </Badge>
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Cómo gastas créditos
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Boost de ficha</strong> ={" "}
              <strong className="tabular-nums text-foreground">{CREDIT_COST_PRODUCT} crédito</strong>
            </li>
            <li>
              <strong className="text-foreground">Scan SEO de URL</strong> ={" "}
              <strong className="tabular-nums text-foreground">{CREDIT_COST_URL_AUDIT} créditos</strong> (más coste de
              cómputo e IA)
            </li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Con tu tarifa actual ({EXTRA_CREDIT_PRICE_EUR[user.plan]} €/crédito), un scan URL completo son{" "}
            <strong className="text-foreground">{scanUrlEur} €</strong> en créditos (
            {CREDIT_COST_URL_AUDIT} × {EXTRA_CREDIT_PRICE_EUR[user.plan]} €).
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border/50 bg-muted/25 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Precio por crédito según plan (referencia)</p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {allPlans.map((p) => (
              <li
                key={p}
                className={p === user.plan ? "font-semibold text-foreground" : ""}
              >
                {planLabel(p)}: {EXTRA_CREDIT_PRICE_EUR[p]} €
                {p === user.plan ? " ← tú" : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          {commerceEnabled ? (
            <BuyCreditsButton
              priceLabel={EXTRA_CREDIT_PRICE_EUR[user.plan]}
              planName={planName}
              unitPriceCents={extraCreditUnitAmountCents(user.plan)}
              plan={user.plan}
              initialQuantity={initialQty}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center">
              <p className="text-sm font-medium text-foreground">Compra de créditos no disponible por ahora</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sigue usando tu cupo mensual del plan. Te avisaremos cuando podamos recargar con Stripe.
              </p>
              <Button asChild className="mt-4" variant="secondary">
                <Link href="/dashboard">Volver al panel</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div id="historial-pagos" className="relative mt-10 space-y-10 scroll-mt-24">
        <CreditsPaymentHistory />
        {commerceEnabled ? <InvoiceRequestForm /> : null}
      </div>

      <p className="relative mt-8 text-center text-sm text-muted-foreground">
        {commerceEnabled ? (
          <>
            ¿Más cupo fijo cada mes?{" "}
            <Link href="/pricing" className="font-semibold text-primary hover:underline">
              Ver planes Pro
            </Link>
          </>
        ) : (
          <>
            Los planes de pago se activarán más adelante.{" "}
            <Link href="/pricing" className="font-semibold text-primary hover:underline">
              Ver precios (informativo)
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
