/**
 * URL canónica del sitio (metadata, JSON-LD, enlaces absolutos).
 * En Vercel, si falta NEXT_PUBLIC_APP_URL, usa VERCEL_URL para que metadataBase sea válida.
 */
export function getPublicSiteUrl(): string {
  const custom = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim();
  if (custom) {
    try {
      const href = custom.includes("://") ? custom : `https://${custom}`;
      const u = new URL(href);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("unsupported protocol");
      return u.toString().replace(/\/$/, "");
    } catch {
      /* continuar con fallbacks */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}
