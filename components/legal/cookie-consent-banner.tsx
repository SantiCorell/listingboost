"use client";

import Link from "next/link";
import { useCookieConsent } from "@/components/legal/cookie-consent-context";
import { Button } from "@/components/ui/button";

export function CookieConsentBanner() {
  const { ready, analyticsChoice, acceptAll, acceptNecessaryOnly } = useCookieConsent();

  if (!ready || analyticsChoice !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 p-4 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] backdrop-blur-md supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">Valoramos tu privacidad</p>
          <p className="mt-1">
            Usamos cookies y almacenamiento local necesarios para el inicio de sesión y el funcionamiento del
            servicio. Con tu consentimiento, medimos visitas agregadas para mejorar el producto.{" "}
            <Link href="/cookies" className="font-medium text-primary underline-offset-4 hover:underline">
              Política de cookies
            </Link>
            ,{" "}
            <Link href="/privacidad" className="font-medium text-primary underline-offset-4 hover:underline">
              privacidad
            </Link>{" "}
            y{" "}
            <Link href="/terminos" className="font-medium text-primary underline-offset-4 hover:underline">
              términos
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={acceptNecessaryOnly}>
            Solo necesarias
          </Button>
          <Button type="button" size="sm" className="w-full sm:w-auto" onClick={acceptAll}>
            Aceptar y medir uso
          </Button>
        </div>
      </div>
    </div>
  );
}
