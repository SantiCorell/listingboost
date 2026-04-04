"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { parseCheckoutResponse } from "@/lib/api/parse-checkout-response";

const PRESETS = [5, 10, 25, 50, 100] as const;

export function BuyCreditsButton({
  priceLabel,
  planName,
  className,
  initialQuantity,
}: {
  /** Ej. "0,70 €" por análisis (según plan en servidor) */
  priceLabel: string;
  /** Nombre del plan del usuario; el checkout usa el Price de Stripe de ese plan */
  planName: string;
  className?: string;
  /** Cantidad inicial (p. ej. desde ?qty= en la URL) */
  initialQuantity?: number;
}) {
  const [qty, setQty] = useState(() =>
    initialQuantity != null
      ? Math.min(500, Math.max(1, initialQuantity))
      : 5,
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuantity != null) {
      setQty(Math.min(500, Math.max(1, initialQuantity)));
    }
  }, [initialQuantity]);

  async function startCheckout() {
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "credits", quantity: qty }),
      });
      if (r.status === 401) {
        window.location.href = "/login?callbackUrl=/pricing/credits";
        return;
      }
      const result = await parseCheckoutResponse(r);
      if (!result.ok) {
        setMsg(result.message);
        return;
      }
      window.location.href = result.url;
    } catch {
      setMsg("Error de red.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`space-y-4 rounded-xl border border-border/60 bg-muted/30 p-5 ${className ?? ""}`}>
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
        <Coins className="h-4 w-4 text-primary" />
        Análisis extra
        <Badge variant="secondary" className="font-normal">
          Plan {planName}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Usamos el <strong className="text-foreground">precio unitario del plan {planName}</strong> (
        <strong className="text-foreground">{priceLabel}</strong> por crédito). Elige cuántos créditos quieres
        aquí; en Stripe verás el mismo total. Si cambias de plan más adelante, las próximas compras usarán la nueva
        tarifa.
      </p>

      <div className="space-y-2">
        <Label className="text-xs">Cantidad rápida</Label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((n) => (
            <Button
              key={n}
              type="button"
              size="sm"
              variant={qty === n ? "default" : "outline"}
              className="min-w-[3rem]"
              onClick={() => setQty(n)}
            >
              {n}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="credit-qty" className="text-xs">
            O introduce un número (1–500)
          </Label>
          <Input
            id="credit-qty"
            type="number"
            min={1}
            max={500}
            value={qty}
            onChange={(e) => setQty(Math.min(500, Math.max(1, Number(e.target.value) || 1)))}
            className="h-10 w-28"
          />
        </div>
        <Button
          type="button"
          size="lg"
          className="font-semibold"
          disabled={loading}
          onClick={startCheckout}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            `Continuar a Stripe · ${qty} crédito${qty === 1 ? "" : "s"}`
          )}
        </Button>
      </div>

      {msg ? <p className="text-xs text-destructive">{msg}</p> : null}
    </div>
  );
}
