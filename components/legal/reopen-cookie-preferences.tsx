"use client";

import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/components/legal/cookie-consent-context";

export function ReopenCookiePreferences() {
  const { openPreferences, resetConsent } = useCookieConsent();

  return (
    <div className="mt-8 rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-sm font-medium text-foreground">¿Quieres cambiar tu elección?</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Abre el panel para activar o desactivar la medición agregada, o borra por completo tu decisión para volver a ver
        el banner (por ejemplo tras limpiar datos del navegador de otra forma).
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button type="button" variant="default" size="sm" className="w-full sm:w-auto" onClick={openPreferences}>
          Abrir preferencias de cookies
        </Button>
        <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={resetConsent}>
          Borrar decisión y mostrar banner de nuevo
        </Button>
      </div>
    </div>
  );
}
