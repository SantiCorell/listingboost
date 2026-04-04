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
          Cada scan consume <strong className="text-foreground">2 créditos</strong> (más intensivo que un boost).
        </p>
      </div>
      <CreditsUpsellBanner />
      <UrlAuditForm />
    </div>
  );
}
