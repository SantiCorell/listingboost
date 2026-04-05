import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasSeoMonitoring } from "@/lib/plan-features";
import { hasUnlimitedMonthlyCredits } from "@/lib/plans";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { runSerpCompetitorInsight } from "@/services/seo/serp-competitor-insight";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Informe premium: SERP + crawl competidores por encima + plan de acción (DeepSeek).
 * POST { "id": "seomonitoring_id" }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = (await req.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  const admin = userIsAdmin(user?.role, user?.email);
  if (!user || (!admin && !hasSeoMonitoring(user.plan))) {
    return NextResponse.json(
      { error: "El informe SERP avanzado requiere plan Pro o superior." },
      { status: 403 },
    );
  }

  const row = await prisma.seoMonitoring.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!row) {
    return NextResponse.json({ error: "Seguimiento no encontrado." }, { status: 404 });
  }

  const cost = FEATURE_CREDITS.SERP_COMPETITOR_INSIGHT;

  try {
    await assertCanAnalyze(session.user.id, cost);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sin créditos" },
      { status: 402 },
    );
  }

  const result = await runSerpCompetitorInsight({
    userId: session.user.id,
    monitoringId: id,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await recordAnalysisUsage(session.user.id, "serp_competitor_insight", cost);

  const charged =
    admin || (user && hasUnlimitedMonthlyCredits(user.plan)) ? 0 : cost;

  return NextResponse.json({
    ok: true,
    output: result.output,
    creditsUsed: charged,
  });
}
