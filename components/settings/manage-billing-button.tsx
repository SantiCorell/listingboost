"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

export function ManageBillingButton({ enabled }: { enabled: boolean }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!enabled) return null;

  async function openPortal() {
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch("/api/stripe/portal", { method: "POST" });
      if (!r.ok) {
        setMsg((await r.text()) || "No se pudo abrir el portal.");
        return;
      }
      const data = (await r.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
      else setMsg("Respuesta sin URL del portal.");
    } catch {
      setMsg("Error de red.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="inline-flex items-center gap-2"
        disabled={loading}
        onClick={openPortal}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        Facturación y método de pago (Stripe)
      </Button>
      {msg ? <p className="text-xs text-destructive">{msg}</p> : null}
      <p className="text-xs text-muted-foreground">
        Cancelar renovación, cambiar tarjeta o descargar facturas. Debes activar el portal de cliente en el
        Dashboard de Stripe (Billing → Customer portal).
      </p>
    </div>
  );
}
