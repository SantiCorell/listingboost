/** Fallback si no hay variables de entorno (producción: definir en el host). */
export const DEFAULT_PUBLIC_CONTACT_EMAIL = "info@listingboost.es";

/** Email público: contacto, legal, pie y Enterprise en UI. */
export function getPublicContactEmail(): string {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_ENTERPRISE_CONTACT_EMAIL?.trim() ||
    DEFAULT_PUBLIC_CONTACT_EMAIL
  );
}
