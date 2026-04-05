"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendSerpInsightLinkEmail } from "@/lib/email/send-serp-insight-link-email";

export type SendSerpInsightEmailState = { ok: true } | { ok: false; error: string };

function appOrigin(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Opcional: envía al email de la cuenta un enlace para volver al informe (no adjunta PDF).
 */
export async function sendSerpInsightReportEmailAction(reportId: string): Promise<SendSerpInsightEmailState> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { ok: false, error: "Debes tener sesión iniciada con email." };
  }

  const row = await prisma.serpCompetitorInsightReport.findFirst({
    where: { id: reportId, userId: session.user.id },
    select: { id: true, keyword: true },
  });
  if (!row) {
    return { ok: false, error: "Informe no encontrado." };
  }

  const reportUrl = `${appOrigin()}/dashboard/history/serp-insight/${row.id}`;
  return sendSerpInsightLinkEmail({
    to: session.user.email,
    keyword: row.keyword,
    reportUrl,
  });
}
