"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

/**
 * Tras Stripe Checkout, confirma pago/suscripción vía API (además del webhook) y limpia la URL.
 */
export function DashboardStripeReturnSync() {
  const sp = useSearchParams();
  const router = useRouter();
  const { update: updateSession } = useSession();
  const lastProcessed = useRef<string | null>(null);
  const [banner, setBanner] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const sid = sp.get("session_id");
    const checkoutOk = sp.get("checkout") === "success";
    const creditsOk = sp.get("credits") === "ok";
    if (!sid || (!checkoutOk && !creditsOk)) return;
    if (lastProcessed.current === sid) return;
    lastProcessed.current = sid;

    void (async () => {
      try {
        const r = await fetch("/api/stripe/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid }),
        });
        const next = new URL(window.location.href);
        next.searchParams.delete("session_id");
        next.searchParams.delete("checkout");
        next.searchParams.delete("credits");
        const clean = next.pathname + (next.searchParams.toString() ? `?${next.searchParams}` : "");
        router.replace(clean);

        if (!r.ok) {
          const t = await r.text();
          setBanner({
            kind: "err",
            text:
              t ||
              "No se pudo confirmar el pago al instante. Si Stripe cobró, el plan o créditos se aplicarán en breve (webhook).",
          });
          return;
        }
        void updateSession();
        const j = (await r.json()) as {
          ok?: boolean;
          alreadyFulfilled?: boolean;
          credits?: number;
        };
        if (creditsOk) {
          const n = j.credits ?? 0;
          const plural = n === 1 ? "crédito" : "créditos";
          setBanner({
            kind: "ok",
            text: j.alreadyFulfilled
              ? `Pago confirmado: +${n} ${plural} (ya estaban aplicados en tu cuenta).`
              : `Pago correcto: +${n} ${plural}.`,
          });
        } else {
          setBanner({ kind: "ok", text: "Suscripción activada. Gracias por confiar en nosotros." });
        }
      } catch {
        setBanner({
          kind: "err",
          text: "Error de red al confirmar el pago. Recarga el resumen en unos segundos.",
        });
      }
    })();
  }, [sp, router, updateSession]);

  if (!banner) return null;
  return (
    <div
      role="status"
      className={
        banner.kind === "ok"
          ? "mb-6 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-950 dark:text-emerald-50"
          : "mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      }
    >
      {banner.text}
    </div>
  );
}
