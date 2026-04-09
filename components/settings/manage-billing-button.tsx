"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Settings2 } from "lucide-react";

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
        setMsg((await r.text()) || "No se pudo abrir la gestión de pago. Inténtalo de nuevo en unos minutos.");
        return;
      }
      const data = (await r.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
      else setMsg("No recibimos el enlace de gestión. Recarga la página e inténtalo de nuevo.");
    } catch {
      setMsg("Error de red.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="gestion-pago" className="scroll-mt-24 space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
      <p className="text-sm font-medium text-foreground">Suscripción y facturación</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Un solo sitio seguro para <strong className="text-foreground">cancelar la renovación</strong>, cambiar tarjeta o
        descargar facturas.         Si cancelas,{" "}
        <strong className="text-foreground">
          sigues usando el plan hasta el último día del periodo ya pagado
        </strong>{" "}
        (típicamente el mismo día del mes en que te diste de alta); no se te cobra el siguiente ciclo.
      </p>
      <Button
        type="button"
        variant="default"
        size="sm"
        className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
        disabled={loading}
        onClick={openPortal}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
        Cancelar o gestionar mi plan
      </Button>
      {msg ? <p className="text-xs text-destructive">{msg}</p> : null}
    </div>
  );
}
