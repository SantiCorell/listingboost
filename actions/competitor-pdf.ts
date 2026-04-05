"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { isProPlusOrHigher } from "@/lib/plans";

export type CompetitorPdfChargeState = { ok: true } | { ok: false; error: string };

/**
 * Autoriza exportar PDF de comparativa. Free y Pro: 1 crédito. Pro+ / Enterprise: gratis.
 * Admin: sin cobro.
 */
export async function chargeCompetitorPdfExport(): Promise<CompetitorPdfChargeState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  if (!user) {
    return { ok: false, error: "Usuario no encontrado." };
  }

  if (userIsAdmin(user.role, user.email) || isProPlusOrHigher(user.plan)) {
    return { ok: true };
  }

  const cost = FEATURE_CREDITS.COMPETITOR_PDF_EXPORT;
  try {
    await assertCanAnalyze(session.user.id, cost);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No tienes créditos suficientes.",
    };
  }

  await recordAnalysisUsage(session.user.id, "competitor_compare_pdf", cost);
  return { ok: true };
}
