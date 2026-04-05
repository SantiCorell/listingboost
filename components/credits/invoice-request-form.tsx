"use client";

import { useState } from "react";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InvoiceRequestForm() {
  const [legalName, setLegalName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [checkoutSessionId, setCheckoutSessionId] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch("/api/billing/invoice-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legalName,
          taxId,
          address,
          checkoutSessionId: checkoutSessionId.trim() || undefined,
          notes: notes.trim() || undefined,
          website,
        }),
      });
      const j = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok) {
        setMsg({ kind: "err", text: j.error ?? "No se pudo enviar." });
        return;
      }
      setMsg({
        kind: "ok",
        text:
          j.ok === true
            ? "Solicitud registrada. Si configuraste email, recibirás confirmación. Te enviaremos la factura lo antes posible."
            : "Listo.",
      });
      setLegalName("");
      setTaxId("");
      setAddress("");
      setCheckoutSessionId("");
      setNotes("");
    } catch {
      setMsg({ kind: "err", text: "Error de red." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card to-violet-500/[0.05] shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-background/80">
            <FileText className="h-5 w-5 text-primary" />
          </span>
          <div>
            <CardTitle className="text-lg">Factura con datos fiscales</CardTitle>
            <CardDescription>
              ¿Empresa o autónomo? Envíanos los datos y te emitimos factura conforme a normativa. Opcional: indica el ID
              de sesión de pago (cs_…) si quieres vincular un cobro concreto.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-legal">Razón social / nombre completo</Label>
              <Input
                id="inv-legal"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
                maxLength={200}
                autoComplete="organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-tax">NIF / CIF / VAT</Label>
              <Input
                id="inv-tax"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                required
                maxLength={32}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-addr">Dirección fiscal completa</Label>
            <textarea
              id="inv-addr"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              maxLength={2000}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-session">ID de sesión Stripe (opcional)</Label>
            <Input
              id="inv-session"
              value={checkoutSessionId}
              onChange={(e) => setCheckoutSessionId(e.target.value)}
              placeholder="cs_test_… o cs_live_…"
              maxLength={120}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Lo encuentras en el historial de pagos de arriba o en el email de Stripe.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-notes">Notas (opcional)</Label>
            <Input
              id="inv-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              placeholder="Ej. pedir factura rectificativa, PO interno…"
            />
          </div>
          {msg ? (
            <p
              role="status"
              className={
                msg.kind === "ok"
                  ? "text-sm text-emerald-800 dark:text-emerald-200"
                  : "text-sm text-destructive"
              }
            >
              {msg.text}
            </p>
          ) : null}
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Enviar solicitud de factura
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
