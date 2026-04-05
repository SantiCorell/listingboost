import { Resend } from "resend";
import { escapeHtml } from "@/lib/email/html-escape";

/**
 * Enlace para restablecer contraseña (válido ~1 h).
 */
export async function sendPasswordResetEmail(input: {
  to: string;
  resetUrl: string;
}): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.warn("[password-reset] Resend no configurado.");
    return { ok: false };
  }

  const resend = new Resend(apiKey);
  const subject = "Restablecer contraseña — ListingBoost";
  const text = [
    "Has solicitado restablecer tu contraseña en ListingBoost.",
    "",
    `Abre este enlace (válido 1 hora):`,
    input.resetUrl,
    "",
    "Si no has sido tú, ignora este mensaje.",
  ].join("\n");

  const html = `
<div style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;">
  <p><strong>Restablecer contraseña</strong></p>
  <p>Has solicitado un enlace para crear una nueva contraseña en ListingBoost.</p>
  <p><a href="${escapeHtml(input.resetUrl)}" style="display:inline-block;margin:12px 0;padding:12px 20px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Restablecer contraseña</a></p>
  <p style="font-size:13px;color:#64748b;">El enlace caduca en 1 hora. Si no has sido tú, puedes ignorar este correo.</p>
</div>`.trim();

  const { error } = await resend.emails.send({
    from,
    to: [input.to],
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[password-reset] Resend", error);
    return { ok: false };
  }
  return { ok: true };
}
