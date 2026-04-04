import { UrlAuditForm } from "@/components/url/url-audit-form";

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Scan SEO · URL</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetch + parse público, scoring por bloques y quick wins vía motor — sin magia negra.
        </p>
      </div>
      <UrlAuditForm />
    </div>
  );
}
