"use client";

import Link from "next/link";
import { useCookieConsent } from "@/components/legal/cookie-consent-context";
import { Button } from "@/components/ui/button";

/**
 * Banner de consentimiento: rechazo y aceptación con prominencia equivalente (criterio AEPD),
 * más personalización granular vía panel.
 */
export function CookieConsentBanner() {
  const { ready, analyticsChoice, acceptAll, acceptNecessaryOnly, openPreferences } = useCookieConsent();

  if (!ready || analyticsChoice !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 p-4 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] backdrop-blur-md supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
          <p id="cookie-banner-title" className="font-semibold text-foreground">
            Tu privacidad importa
          </p>
          <p id="cookie-banner-desc" className="mt-2">
            Usamos tecnologías necesarias (sesión, seguridad) para prestar el servicio. Solo si lo aceptas, medimos
            visitas de forma agregada para mejorar el producto. Puedes rechazar lo opcional, personalizar o leer la
            información legal antes de decidir.
          </p>
          <p className="mt-2 text-xs leading-relaxed">
            <Link href="/cookies" className="font-medium text-primary underline-offset-4 hover:underline" prefetch={false}>
              Política de cookies
            </Link>
            {" · "}
            <Link
              href="/privacidad"
              className="font-medium text-primary underline-offset-4 hover:underline"
              prefetch={false}
            >
              Privacidad (RGPD)
            </Link>
            {" · "}
            <Link href="/terminos" className="font-medium text-primary underline-offset-4 hover:underline" prefetch={false}>
              Términos de uso
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full min-h-11 border-2 sm:min-h-9 sm:w-auto sm:min-w-[10rem]"
            onClick={acceptNecessaryOnly}
          >
            Rechazar opcionales
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full min-h-11 sm:min-h-9 sm:w-auto sm:min-w-[10rem]"
            onClick={openPreferences}
          >
            Personalizar
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-full min-h-11 sm:min-h-9 sm:w-auto sm:min-w-[10rem]"
            onClick={acceptAll}
          >
            Aceptar todas
          </Button>
        </div>
      </div>
    </div>
  );
}
