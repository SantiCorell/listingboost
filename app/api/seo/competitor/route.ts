import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { isPaidPlan } from "@/lib/plans";
import { runCompetitorAnalysis } from "@/services/seo/competitor-analysis";

export const runtime = "nodejs";
export const maxDuration = 180;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  if (!userIsAdmin(user.role, user.email) && !isPaidPlan(user.plan)) {
    return NextResponse.json(
      {
        error: "La comparativa competidor requiere plan de pago (Pro o Pro+).",
      },
      { status: 403 },
    );
  }

  let body: { urlA?: string; urlB?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  let urlA: URL;
  let urlB: URL;
  try {
    urlA = new URL(body.urlA ?? "");
    urlB = new URL(body.urlB ?? "");
  } catch {
    return NextResponse.json({ error: "URLs inválidas" }, { status: 400 });
  }

  const cost = FEATURE_CREDITS.COMPETITOR_COMPARE;

  try {
    await assertCanAnalyze(session.user.id, cost);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sin créditos" },
      { status: 402 },
    );
  }

  const result = await runCompetitorAnalysis({
    userId: session.user.id,
    urlA: urlA.toString(),
    urlB: urlB.toString(),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await prisma.competitorAnalysis.create({
    data: {
      userId: session.user.id,
      urlA: urlA.toString(),
      urlB: urlB.toString(),
      outputJson: result.output as object,
      creditsUsed: cost,
    },
  });

  await recordAnalysisUsage(session.user.id, "competitor_compare", cost);

  return NextResponse.json({ ok: true, output: result.output, creditsUsed: cost });
}
