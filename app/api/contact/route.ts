import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getPublicContactEmail } from "@/lib/contact";
import { escapeHtml } from "@/lib/email/html-escape";

export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(8000),
  /** Honeypot: debe ir vacío */
  website: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisa nombre, email y mensaje." },
      { status: 400 },
    );
  }

  const { name, email, message, website } = parsed.data;
  if (website && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.warn(
      "[contact] Resend no configurado: RESEND_API_KEY y RESEND_FROM_EMAIL en el servidor.",
    );
    return NextResponse.json(
      { error: "El envío por formulario no está configurado." },
      { status: 503 },
    );
  }

  const to =
    process.env.CONTACT_TO_EMAIL?.trim() || getPublicContactEmail();

  const subject = `Contacto ListingBoost${name ? ` — ${name}` : ""}`;
  const text = [
    name ? `Nombre: ${name}` : null,
    `Email de respuesta: ${email}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
<div style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;">
  <p><strong>Contacto</strong> desde listingboost.es</p>
  ${name ? `<p><strong>Nombre:</strong> ${escapeHtml(name)}</p>` : ""}
  <p><strong>Email:</strong> ${escapeHtml(email)}</p>
  <p><strong>Mensaje:</strong></p>
  <pre style="white-space:pre-wrap;font-family:inherit;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">${escapeHtml(message)}</pre>
</div>`.trim();

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[contact] Resend:", error);
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Inténtalo más tarde." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
