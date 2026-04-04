/**
 * Pagos Stripe (suscripciones + créditos). Desactivado por defecto hasta que la cuenta esté habilitada.
 * Pon `NEXT_PUBLIC_COMMERCE_ENABLED=true` en `.env.local` o en el host para activar checkout y portal.
 */
export function isCommerceEnabled(): boolean {
  return process.env.NEXT_PUBLIC_COMMERCE_ENABLED === "true";
}
