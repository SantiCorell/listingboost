"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCookieConsent } from "@/components/legal/cookie-consent-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";

export function CookiePreferencesSheet() {
  const { preferencesOpen, closePreferences, savePreferences, analyticsChoice } = useCookieConsent();
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (preferencesOpen) {
      setAnalytics(analyticsChoice === true);
    }
  }, [preferencesOpen, analyticsChoice]);

  return (
    <Sheet open={preferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
      <SheetContent
        side="bottom"
        className="z-[120] max-h-[min(92dvh,640px)] overflow-y-auto rounded-t-2xl border-t border-border/80 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:mx-auto sm:max-w-lg"
      >
        <SheetHeader className="space-y-2 text-left">
          <SheetTitle id="cookie-prefs-title">Preferencias de cookies</SheetTitle>
          <SheetDescription className="sr-only">
            Configura cookies necesarias y opcionales de {APP_NAME}.
          </SheetDescription>
          <p className="text-left text-sm leading-relaxed text-muted-foreground">
            Elige qué tecnologías opcionales permites en <strong className="text-foreground">{APP_NAME}</strong>. Las
            necesarias no se pueden desactivar porque hacen posible el servicio (sesión, seguridad).
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
            <p className="text-sm font-semibold text-foreground">Estrictamente necesarias</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Sesión (Auth.js), seguridad y funciones imprescindibles. Siempre activas según la normativa aplicable.
            </p>
          </div>

          <div className="flex gap-3 rounded-xl border border-border/70 p-4">
            <Checkbox
              id="cookie-analytics"
              checked={analytics}
              onCheckedChange={(v) => setAnalytics(v === true)}
              className="mt-0.5"
              aria-describedby="cookie-analytics-desc"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <Label htmlFor="cookie-analytics" className="cursor-pointer text-sm font-semibold text-foreground">
                Medición agregada de uso
              </Label>
              <p id="cookie-analytics-desc" className="text-xs leading-relaxed text-muted-foreground">
                Identificador anónimo local (<code className="rounded bg-muted px-1 font-mono text-[11px]">lb_vid</code>)
                y registro de rutas visitadas de forma agregada para mejorar el producto. Sin cookies de publicidad de
                terceros con fines de perfilado en esta política.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Documentación legal:{" "}
          <Link href="/cookies" className="font-medium text-primary underline-offset-4 hover:underline" prefetch={false}>
            Política de cookies
          </Link>
          ,{" "}
          <Link
            href="/privacidad"
            className="font-medium text-primary underline-offset-4 hover:underline"
            prefetch={false}
          >
            Privacidad (RGPD)
          </Link>{" "}
          y{" "}
          <Link href="/terminos" className="font-medium text-primary underline-offset-4 hover:underline" prefetch={false}>
            Términos de uso
          </Link>
          .
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={closePreferences}>
            Cancelar
          </Button>
          <Button type="button" className="w-full sm:w-auto" onClick={() => savePreferences(analytics)}>
            Guardar preferencias
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
