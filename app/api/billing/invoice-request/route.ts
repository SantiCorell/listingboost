import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPublicContactEmail } from "@/lib/contact";
import { escapeHtml } from "@/lib/email/html-escape";

export const runtime = "nodejs";

const bodySchema = z.object({
  legalName: z.string().trim().min(2).max(200),
  taxId: z.string().trim().min(5).max(32),
  address: z.string().trim().min(8).max(2000),
  checkoutSessionId: z.string().max(120).optional(),
  notes: z.string().trim().max(2000).optional(),
  website: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa razón social, NIF/CIF y dirección." }, { status: 400 });
  }

  const { legalName, taxId, address, checkoutSessionId, notes, website } = parsed.data;
  if (website && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true },
  });
  const email = user?.email ?? null;

  await prisma.billingInvoiceRequest.create({
    data: {
      userId: session.user.id,
      userEmail: email,
      checkoutSessionId: checkoutSessionId?.trim() || null,
      legalName,
      taxId,
      address,
      notes: notes?.trim() || null,
    },
  });

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || getPublicContactEmail();

  if (!apiKey || !from) {
    console.warn("[invoice-request] Resend no configurado; solicitud guardada en BD.");
    return NextResponse.json({ ok: true, saved: true, emailed: false });
  }

  const subject = `Factura / datos fiscales — ${legalName}`;
  const text = [
    `Solicitud de factura (ListingBoost)`,
    "",
    `Usuario ID: ${session.user.id}`,
    `Email cuenta: ${email ?? "—"}`,
    `Nombre: ${user?.name ?? "—"}`,
    checkoutSessionId ? `Sesión Stripe (si aplica): ${checkoutSessionId}` : null,
    "",
    `Razón social: ${legalName}`,
    `NIF/CIF: ${taxId}`,
    `Dirección fiscal:`,
    address,
    notes ? `\nNotas:\n${notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
<div style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;">
  <p><strong>Solicitud de factura</strong> — listingboost.es</p>
  <p><strong>Usuario:</strong> ${escapeHtml(session.user.id)} · ${escapeHtml(email ?? "—")}</p>
  ${checkoutSessionId ? `<p><strong>Sesión checkout:</strong> ${escapeHtml(checkoutSessionId)}</p>` : ""}
  <p><strong>Razón social:</strong> ${escapeHtml(legalName)}</p>
  <p><strong>NIF/CIF:</strong> ${escapeHtml(taxId)}</p>
  <p><strong>Dirección fiscal:</strong></p>
  <pre style="white-space:pre-wrap;font-family:inherit;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">${escapeHtml(address)}</pre>
  ${notes ? `<p><strong>Notas:</strong></p><pre style="white-space:pre-wrap;font-family:inherit;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">${escapeHtml(notes)}</pre>` : ""}
</div>`.trim();

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email ?? undefined,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[invoice-request] Resend", error);
    return NextResponse.json({ ok: true, saved: true, emailed: false });
  }

  if (email) {
    await resend.emails.send({
      from,
      to: [email],
      subject: "Hemos recibido tu solicitud de factura — ListingBoost",
      text: `Hola,\n\nHemos registrado tu solicitud de factura a nombre de "${legalName}" (${taxId}).\nTe contactaremos o te enviaremos la factura en cuanto esté lista.\n\n— Equipo ListingBoost`,
    });
  }

  return NextResponse.json({ ok: true, saved: true, emailed: true });
}
