import { Suspense } from "react";
import { UrlAuditForm } from "@/components/url/url-audit-form";
import { CreditsUpsellBanner } from "@/components/pricing/credits-upsell-banner";
import { UrlAuditDocLinks } from "@/components/url/url-audit-doc-links";

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Scan SEO de URL</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Analizamos el HTML público de tu página como haría un buscador: metadatos, estructura, imágenes, enlaces y
            señales de datos estructurados. Recibes un <strong className="font-medium text-foreground">score</strong>{" "}
            por bloques y un listado de <strong className="font-medium text-foreground">mejoras priorizadas</strong>,
            con apoyo de nuestro motor cuando elijas el preset con informe IA. Sin humo: criterio técnico + acciones
            claras para tu equipo.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Créditos por ejecución: <strong className="text-foreground">2</strong> (esencial) ·{" "}
            <strong className="text-foreground">3</strong> (estándar) · <strong className="text-foreground">5</strong>{" "}
            (completo con inventario de sitemaps). Exportar el informe a PDF: <strong className="text-foreground">+1</strong>{" "}
            crédito tras tener el análisis guardado.
          </p>
        </div>
        <UrlAuditDocLinks />
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
