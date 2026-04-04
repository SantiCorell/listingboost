/**
 * Pagos Stripe (suscripciones + créditos). Activado por defecto.
 * Pon `NEXT_PUBLIC_COMMERCE_ENABLED=false` solo si quieres desactivar checkout, portal y compra de créditos.
 */
export function isCommerceEnabled(): boolean {
  return process.env.NEXT_PUBLIC_COMMERCE_ENABLED !== "false";
}
