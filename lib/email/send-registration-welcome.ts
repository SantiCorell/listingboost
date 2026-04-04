import { Resend } from "resend";
import { escapeHtml } from "@/lib/email/html-escape";

const DEFAULT_TEMPLATE_ALIAS = "listing-boost-welcome";

/**
 * Email de bienvenida al registrarse (plantilla publicada en Resend).
 * Si la plantilla falla (variables, id, etc.), envía un HTML sencillo de respaldo.
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
    console.warn(
      "[registration-welcome] Resend no configurado: define RESEND_API_KEY y RESEND_FROM_EMAIL en el servidor (Vercel / .env.local).",
    );
    return;
  }

  const name = input.name.trim() || input.to.split("@")[0] || "Usuario";
  const subjectFallback =
    process.env.RESEND_WELCOME_SUBJECT?.trim() || "Bienvenido a ListingBoost";

  const resend = new Resend(apiKey);

  const templateResult = await resend.emails.send({
    from,
    to: [input.to],
    template: {
      id: templateId,
      variables: { name },
    },
    tags: [{ name: "type", value: "registration-welcome" }],
  });

  if (!templateResult.error) {
    return;
  }

  console.error("[registration-welcome] plantilla Resend:", templateResult.error);

  const plain = `Hola ${name},

Gracias por registrarte en ListingBoost. Ya puedes iniciar sesión y crear tu primer boost o un scan SEO de URL.

— El equipo de ListingBoost`;

  const fallback = await resend.emails.send({
    from,
    to: [input.to],
    subject: subjectFallback,
    html: `<p>Hola ${escapeHtml(name)},</p>
<p>Gracias por registrarte en <strong>ListingBoost</strong>. Ya puedes iniciar sesión y crear tu primer boost o un scan SEO de URL.</p>
<p style="color:#64748b;font-size:14px;">— El equipo de ListingBoost</p>`,
    text: plain,
  });

  if (fallback.error) {
    console.error("[registration-welcome] envío alternativo Resend:", fallback.error);
  }
}
