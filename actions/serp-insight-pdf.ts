"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { FEATURE_CREDITS } from "@/lib/feature-credits";

export type SerpInsightPdfChargeState = { ok: true } | { ok: false; error: string };

/**
 * Autoriza exportar PDF de un informe SERP ya guardado. 1 crédito (Enterprise/admin: sin descuento de cupo según reglas).
 */
export async function chargeSerpInsightPdfExport(reportId: string): Promise<SerpInsightPdfChargeState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const row = await prisma.serpCompetitorInsightReport.findFirst({
    where: { id: reportId, userId: session.user.id },
    select: { id: true },
  });
  if (!row) {
    return { ok: false, error: "Informe no encontrado." };
  }

  const cost = FEATURE_CREDITS.SERP_INSIGHT_PDF_EXPORT;
  try {
    await assertCanAnalyze(session.user.id, cost);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No tienes créditos suficientes.",
    };
  }

  await recordAnalysisUsage(session.user.id, "serp_insight_pdf", cost);
  return { ok: true };
}
