/** True si el servidor puede llamar a la API de Stripe (Vercel: STRIPE_SECRET_KEY). */
export function isStripeSecretConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}
