import type Stripe from "stripe";

/**
 * Si el Dashboard no tiene métodos de pago activos para la divisa (p. ej. EUR),
 * Checkout falla sin tipos explícitos. `card` es compatible con suscripción y pago único.
 */
export const stripeCheckoutPaymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
  ["card"];

/** Opciones comunes para Checkout (3DS automático, idioma ES). */
export const stripeCheckoutCommonParams = {
  locale: "es" as const,
  payment_method_options: {
    card: {
      request_three_d_secure: "automatic" as const,
    },
  },
} satisfies Pick<
  Stripe.Checkout.SessionCreateParams,
  "locale" | "payment_method_options"
>;
