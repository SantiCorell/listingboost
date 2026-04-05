"use client";

import { useState, useEffect, useMemo } from "react";
import type { Plan } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Coins, Receipt, Sparkles, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { parseCheckoutResponse } from "@/lib/api/parse-checkout-response";
import { creditPacksAvailableForPlan, freeCreditPacks } from "@/lib/credit-packs";
import { formatEurUnitsFromCents } from "@/lib/plans";
import { cn } from "@/lib/utils";

const PRESETS = [1, 5, 10, 25, 50, 100] as const;

export function BuyCreditsButton({
  priceLabel,
  planName,
  unitPriceCents,
  plan,
  className,
  initialQuantity,
}: {
  /** Ej. "1,00" sin símbolo (según plan) */
  priceLabel: string;
  planName: string;
  /** Precio de un crédito en céntimos (EUR), alineado con Stripe */
  unitPriceCents: number;
  plan: Plan;
  className?: string;
  initialQuantity?: number;
}) {
  const [qty, setQty] = useState(() =>
    initialQuantity != null ? Math.min(500, Math.max(1, initialQuantity)) : 5,
  );
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const packs = useMemo(
    () => (creditPacksAvailableForPlan(plan) ? freeCreditPacks() : []),
    [plan],
  );

  useEffect(() => {
    if (initialQuantity != null) {
      setQty(Math.min(500, Math.max(1, initialQuantity)));
    }
  }, [initialQuantity]);

  const totalCents = useMemo(() => unitPriceCents * qty, [unitPriceCents, qty]);
  const totalFormatted = formatEurUnitsFromCents(totalCents);

  const selectedPack = selectedPackId ? packs.find((p) => p.id === selectedPackId) : null;

  async function startCheckoutPack(packId: string) {
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "credits", pack: packId }),
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

  async function startCheckoutAlacarte() {
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
    <div
      className={cn(
        "space-y-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card/90 to-violet-500/[0.05] p-5 shadow-md sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <Coins className="h-4 w-4" />
          </span>
          Comprar créditos extra
          <Badge variant="secondary" className="font-normal">
            Plan {planName}
          </Badge>
        </div>
      </div>

      {packs.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Percent className="h-3.5 w-3.5" />
            Packs con descuento (solo Free)
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {packs.map((p) => {
              const packTotal = formatEurUnitsFromCents(p.totalCents);
              const listTotal = formatEurUnitsFromCents(p.listTotalCents);
              const active = selectedPackId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPackId(p.id);
                  }}
                  className={cn(
                    "relative rounded-xl border bg-background/90 p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md",
                    active ? "border-primary ring-2 ring-primary/25" : "border-border/70",
                  )}
                >
                  <Badge className="absolute right-3 top-3 font-mono text-[10px]">−{p.discountPercent}%</Badge>
                  <p className="pr-14 text-sm font-semibold text-foreground">{p.label}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{p.shortHint}</p>
                  <p className="mt-3 font-mono text-lg font-bold tabular-nums text-primary">{packTotal} €</p>
                  <p className="text-[10px] text-muted-foreground line-through">Antes {listTotal} € a precio unitario</p>
                  <p className="mt-2 text-xs font-medium text-foreground">{p.credits} créditos</p>
                </button>
              );
            })}
          </div>
          {selectedPack ? (
            <Button
              type="button"
              size="lg"
              className="h-12 w-full gap-2 font-semibold shadow-md"
              disabled={loading}
              onClick={() => void startCheckoutPack(selectedPack.id)}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Pagar pack {selectedPack.credits} créditos
                  <span className="rounded-md bg-primary-foreground/15 px-2 py-0.5 text-sm tabular-nums">
                    {formatEurUnitsFromCents(selectedPack.totalCents)} €
                  </span>
                </>
              )}
            </Button>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Toca un pack para seleccionarlo y continuar a Stripe, o compra créditos sueltos abajo.
            </p>
          )}
        </div>
      ) : null}

      {packs.length > 0 ? (
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide text-muted-foreground">
            <span className="bg-card px-3">O compra al detalle</span>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-border/60 bg-background/80 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Receipt className="h-3.5 w-3.5" />
          Desglose (igual que en Stripe)
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Precio por crédito (tu plan)</dt>
            <dd className="font-mono tabular-nums font-semibold text-foreground">{priceLabel} €</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Cantidad</dt>
            <dd className="font-mono tabular-nums font-semibold text-foreground">{qty}</dd>
          </div>
          <div className="border-t border-border/70 pt-2">
            <div className="flex justify-between gap-4">
              <dt className="text-base font-semibold text-foreground">Total a pagar</dt>
              <dd className="text-xl font-bold tabular-nums tracking-tight text-primary">{totalFormatted} €</dd>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              En Stripe Checkout verás <strong className="text-foreground">una línea</strong> con ese total:{" "}
              <strong className="text-foreground">{qty}</strong> unidad
              {qty === 1 ? "" : "es"} × {priceLabel} €. Al completar el pago se acreditan{" "}
              <strong className="text-foreground">{qty}</strong> crédito{qty === 1 ? "" : "s"} en tu cuenta.
            </p>
          </div>
        </dl>
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        Cada plan usa su <strong className="text-foreground">propio precio unitario</strong> en Stripe (Free paga más
        por crédito; Pro y Pro+ menos). Si mejoras de plan, las siguientes compras usarán la tarifa nueva.
      </p>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Cantidad rápida</Label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((n) => (
            <Button
              key={n}
              type="button"
              size="sm"
              variant={qty === n ? "default" : "outline"}
              className="min-w-[2.75rem] font-mono"
              onClick={() => {
                setQty(n);
                setSelectedPackId(null);
              }}
            >
              {n}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="credit-qty" className="text-xs">
            O introduce 1–500
          </Label>
          <Input
            id="credit-qty"
            type="number"
            min={1}
            max={500}
            value={qty}
            onChange={(e) => {
              setQty(Math.min(500, Math.max(1, Number(e.target.value) || 1)));
              setSelectedPackId(null);
            }}
            className="h-11 w-32 font-mono"
          />
        </div>
        <Button
          type="button"
          size="lg"
          className="h-12 flex-1 gap-2 font-semibold shadow-md sm:min-w-[240px]"
          disabled={loading}
          onClick={() => void startCheckoutAlacarte()}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Continuar a Stripe
              <span className="rounded-md bg-primary-foreground/15 px-2 py-0.5 text-sm tabular-nums">
                {totalFormatted} €
              </span>
            </>
          )}
        </Button>
      </div>

      {msg ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
