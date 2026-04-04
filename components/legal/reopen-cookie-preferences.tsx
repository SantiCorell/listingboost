"use client";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "lb_cookie_consent_v1";

export function ReopenCookiePreferences() {
  return (
    <div className="mt-8 rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-sm font-medium text-foreground">¿Quieres cambiar tu elección?</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Al restablecer, volverá a aparecer el banner en la próxima visita o al recargar.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() => {
          try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem("lb_vid");
          } catch {
            /* ignore */
          }
          window.location.reload();
        }}
      >
        Restablecer preferencias de cookies
      </Button>
    </div>
  );
}
