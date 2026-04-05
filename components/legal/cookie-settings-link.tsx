"use client";

import { useCookieConsent } from "@/components/legal/cookie-consent-context";
import { cn } from "@/lib/utils";

/**
 * Enlace en pie o textos legales para reabrir el panel sin recargar.
 */
export function CookieSettingsLink({ className }: { className?: string }) {
  const { openPreferences } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={() => openPreferences()}
      className={cn(
        "text-left text-sm text-muted-foreground transition-colors hover:text-foreground underline-offset-4 hover:underline",
        className,
      )}
    >
      Configurar cookies
    </button>
  );
}
