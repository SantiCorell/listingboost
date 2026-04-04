"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { CREDIT_URL_AUDIT_PDF } from "@/lib/url-audit/credits-config";

export type PdfChargeState =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Cobra 1 crédito y autoriza la exportación PDF de una auditoría ya guardada.
 * El PDF se genera en el cliente con los datos que ya tienes (o re-fetch opcional).
 */
export async function chargeUrlAuditPdfExport(auditId: string): Promise<PdfChargeState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const row = await prisma.urlAudit.findFirst({
    where: { id: auditId, userId: session.user.id },
    select: { id: true },
  });
  if (!row) {
    return { ok: false, error: "Auditoría no encontrada." };
  }

  try {
    await assertCanAnalyze(session.user.id, CREDIT_URL_AUDIT_PDF);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No tienes créditos suficientes.",
    };
  }

  await recordAnalysisUsage(session.user.id, "url_audit_pdf", CREDIT_URL_AUDIT_PDF);
  return { ok: true };
}
