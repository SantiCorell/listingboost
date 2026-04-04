import { APP_NAME } from "@/lib/constants";
import { getPublicContactEmail } from "@/lib/contact";

/** Email de contacto para ejercicio de derechos y consultas legales. */
export function legalContactEmail(): string {
  return getPublicContactEmail();
}

/** Denominación del titular del sitio (configurable en despliegue). */
export function legalEntityName(): string {
  return process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME?.trim() || APP_NAME;
}

export function legalSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://listingboost.es";
}
