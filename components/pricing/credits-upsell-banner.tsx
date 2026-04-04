import Link from "next/link";
import { Coins } from "lucide-react";
import { isCommerceEnabled } from "@/lib/commerce";
import { Button } from "@/components/ui/button";

/** Cinta compacta para recordar compra de créditos (dashboard / flujos de consumo). */
export function CreditsUpsellBanner() {
  if (!isCommerceEnabled()) return null;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-gradient-to-r from-primary/[0.08] to-violet-500/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-snug text-muted-foreground">
        <strong className="text-foreground">¿Sin cupo este mes?</strong> Compra créditos extra al precio de tu plan (pago
        con Stripe, se aplican al instante).
      </p>
      <Button asChild size="sm" className="shrink-0 gap-1.5 font-semibold shadow-sm">
        <Link href="/pricing/credits">
          <Coins className="h-4 w-4" />
          Comprar créditos
        </Link>
      </Button>
    </div>
  );
}
