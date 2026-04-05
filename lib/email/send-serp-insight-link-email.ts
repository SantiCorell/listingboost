import { Resend } from "resend";
import { APP_NAME } from "@/lib/constants";
import { escapeHtml } from "@/lib/email/html-escape";

/**
 * Envía enlace al informe SERP guardado (opcional; PDF sigue siendo en pantalla).
 */
export async function sendSerpInsightLinkEmail(input: {
  to: string;
  keyword: string;
  reportUrl: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return { ok: false, error: "El envío por correo no está configurado (Resend)." };
  }

  const kw = input.keyword.trim() || "tu consulta";
  const subject = `${APP_NAME}: enlace a tu informe SERP «${kw.slice(0, 60)}${kw.length > 60 ? "…" : ""}»`;
  const safeUrl = escapeHtml(input.reportUrl);
  const safeKw = escapeHtml(kw);

  const html = `
  <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#0f172a;max-width:560px">
    <p>Hola,</p>
    <p>Has pedido recibir el enlace a tu <strong>informe SERP vs competidores</strong> para la consulta <strong>«${safeKw}»</strong>.</p>
    <p><a href="${safeUrl}" style="display:inline-block;margin:12px 0;padding:12px 20px;background:#6d28d9;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">Abrir informe en ${escapeHtml(APP_NAME)}</a></p>
    <p style="font-size:14px;color:#64748b">Desde esa página puedes leer el informe completo y, si quieres, <strong>descargar el PDF</strong> (consume 1 crédito como en auditorías URL).</p>
    <p style="font-size:13px;color:#94a3b8">Si no solicitaste este correo, ignóralo.</p>
  </div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [input.to],
    subject,
    html,
  });
  if (error) {
    console.error("[serp-insight-email] Resend", error);
    return { ok: false, error: "No se pudo enviar el correo. Inténtalo más tarde." };
  }
  return { ok: true };
}
