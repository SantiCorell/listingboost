"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SubscriptionCheckoutPlan } from "@/lib/stripe/plan-mapping";
import { Loader2 } from "lucide-react";

export function CheckoutPlanButton({
  plan,
  children,
  className,
  variant = "default",
}: {
  plan: SubscriptionCheckoutPlan;
  children: React.ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onClick() {
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subscription", plan }),
      });
      if (r.status === 401) {
        window.location.href = "/login?callbackUrl=/pricing";
        return;
      }
      if (!r.ok) {
        const t = await r.text();
        setMsg(t || "No se pudo iniciar el pago.");
        return;
      }
      const data = (await r.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
      else setMsg("No se recibió URL de checkout.");
    } catch {
      setMsg("Error de red.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-2">
      <Button
        type="button"
        className={cn("h-auto min-h-12 w-full whitespace-normal px-3 py-3 text-center leading-snug", className)}
        variant={variant}
        disabled={loading}
        onClick={onClick}
      >
        {loading ? <Loader2 className="animate-spin" /> : children}
      </Button>
      {msg ? <p className="text-xs text-destructive">{msg}</p> : null}
    </div>
  );
}
