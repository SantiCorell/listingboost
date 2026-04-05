import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { runBlogOptimizer } from "@/services/seo/blog-optimizer";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { rawText?: string };
  try {
    body = (await req.json()) as { rawText?: string };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const rawText = body.rawText?.trim() ?? "";
  const cost = FEATURE_CREDITS.BLOG_OPTIMIZE;

  try {
    await assertCanAnalyze(session.user.id, cost);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sin créditos" },
      { status: 402 },
    );
  }

  const result = await runBlogOptimizer({ userId: session.user.id, rawText });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await prisma.blogOptimization.create({
    data: {
      userId: session.user.id,
      inputText: rawText.slice(0, 50000),
      outputJson: result.output as object,
      creditsUsed: cost,
    },
  });

  await recordAnalysisUsage(session.user.id, "blog_optimize", cost);

  return NextResponse.json({ ok: true, output: result.output, creditsUsed: cost });
}
