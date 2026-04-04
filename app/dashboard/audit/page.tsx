import { Suspense } from "react";
import { UrlAuditForm } from "@/components/url/url-audit-form";
import { CreditsUpsellBanner } from "@/components/pricing/credits-upsell-banner";

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Scan SEO · URL</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetch + parse público, scoring por bloques y quick wins vía motor — sin magia negra.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Elige preset: desde <strong className="text-foreground">2 créditos</strong> (esencial) hasta{" "}
          <strong className="text-foreground">5</strong> (completo con sitemap). El PDF del informe: +1 crédito.
        </p>
      </div>
      <CreditsUpsellBanner />
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Cargando formulario de análisis…</p>}
      >
        <UrlAuditForm />
      </Suspense>
    </div>
  );
}
