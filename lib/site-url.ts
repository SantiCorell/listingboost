/**
 * URL canónica absoluta (metadata, sitemap, robots, JSON-LD).
 *
 * Orden de prioridad (evita URLs *.vercel.app en sitemap de producción en Search Console):
 * 1. NEXT_PUBLIC_APP_URL o NEXT_PUBLIC_SITE_URL — define en Vercel el dominio público (ej. https://www.listingboost.es)
 * 2. VERCEL_PROJECT_PRODUCTION_URL — dominio de producción del proyecto en Vercel
 * 3. VERCEL_URL — solo último recurso (previews; no usar para GSC si puedes fijar la variable pública)
 */
function normalizeUrl(raw: string): string | null {
  const t = raw.replace(/\/$/, "").trim();
  if (!t) return null;
  try {
    const href = t.includes("://") ? t : `https://${t}`;
    const u = new URL(href);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getPublicSiteUrl(): string {
  const keys = ["NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_SITE_URL"] as const;
  for (const key of keys) {
    const v = process.env[key];
    if (v) {
      const n = normalizeUrl(v);
      if (n) return n;
    }
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    const n = normalizeUrl(production);
    if (n) return n;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}
