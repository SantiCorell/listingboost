import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { runSeoQuickFix } from "@/services/seo/quick-fix";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { auditId?: string; issueId?: string };
  try {
    body = (await req.json()) as { auditId?: string; issueId?: string };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.auditId || !body.issueId) {
    return NextResponse.json({ error: "Faltan auditId o issueId" }, { status: 400 });
  }

  const cost = FEATURE_CREDITS.SEO_QUICK_FIX;
  try {
    await assertCanAnalyze(session.user.id, cost);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sin créditos" },
      { status: 402 },
    );
  }

  const result = await runSeoQuickFix({
    userId: session.user.id,
    auditId: body.auditId,
    issueId: body.issueId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await recordAnalysisUsage(session.user.id, "seo_quick_fix", cost);

  return NextResponse.json({ ok: true, output: result.output, creditsUsed: cost });
}
