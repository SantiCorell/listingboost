import { Resend } from "resend";

const DEFAULT_TEMPLATE_ALIAS = "listing-boost-welcome";

/**
 * Email de bienvenida al registrarse (plantilla publicada en Resend).
 * No lanza: los fallos se registran y no bloquean el alta.
 */
export async function sendRegistrationWelcomeEmail(input: {
  to: string;
  /** Nombre para saludar; si falta, se usa la parte local del email. */
  name: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const templateId =
    process.env.RESEND_WELCOME_TEMPLATE_ID?.trim() || DEFAULT_TEMPLATE_ALIAS;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[registration-welcome] Falta RESEND_API_KEY o RESEND_FROM_EMAIL");
    }
    return;
  }

  const name = input.name.trim() || input.to.split("@")[0] || "Usuario";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [input.to],
    template: {
      id: templateId,
      variables: {
        name,
      },
    },
    tags: [{ name: "type", value: "registration-welcome" }],
  });

  if (error) {
    console.error("[registration-welcome] Resend:", error);
  }
}
