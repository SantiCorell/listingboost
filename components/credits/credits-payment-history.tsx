"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Row = {
  checkoutSessionId: string;
  credits: number;
  amountTotalCents: number | null;
  currency: string | null;
  createdAt: string;
};

function formatMoney(cents: number | null, currency: string | null): string {
  if (cents == null || !currency) return "—";
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

export function CreditsPaymentHistory() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/stripe/payments");
      if (!r.ok) {
        setErr("No se pudo cargar el historial.");
        setRows([]);
        return;
      }
      const j = (await r.json()) as { payments?: Row[] };
      setRows(j.payments ?? []);
    } catch {
      setErr("Error de red.");
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function openReceipt(sessionId: string) {
    setLoadingReceipt(sessionId);
    setErr(null);
    try {
      const r = await fetch(`/api/stripe/receipt?session_id=${encodeURIComponent(sessionId)}`);
      const j = (await r.json()) as { receiptUrl?: string; error?: string };
      if (!r.ok || !j.receiptUrl) {
        setErr(j.error ?? "Recibo no disponible.");
        return;
      }
      window.open(j.receiptUrl, "_blank", "noopener,noreferrer");
    } catch {
      setErr("No se pudo abrir el recibo.");
    } finally {
      setLoadingReceipt(null);
    }
  }

  if (rows === null) {
    return (
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-lg">Pagos y recibos</CardTitle>
          <CardDescription>Cargando historial…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Pagos y recibos</CardTitle>
        <CardDescription>
          Compras de créditos registradas en tu cuenta. Descarga el recibo oficial de Stripe cuando lo necesites.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {err ? (
          <p className="text-sm text-amber-800 dark:text-amber-200" role="alert">
            {err}
          </p>
        ) : null}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay compras registradas. Tras completar un pago con Stripe, aparecerán aquí.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Créditos</th>
                  <th className="px-4 py-3 font-semibold">Importe</th>
                  <th className="px-4 py-3 font-semibold text-right">Recibo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.checkoutSessionId} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString("es-ES", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums text-foreground">
                      +{r.credits}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatMoney(r.amountTotalCents, r.currency)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => void openReceipt(r.checkoutSessionId)}
                        disabled={loadingReceipt === r.checkoutSessionId}
                      >
                        {loadingReceipt === r.checkoutSessionId ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Receipt className="h-3.5 w-3.5" />
                        )}
                        Recibo
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
