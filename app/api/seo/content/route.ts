import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { runContentGenerator } from "@/services/seo/content-generator";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { keyword?: string; type?: "blog" | "product"; country?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.keyword?.trim()) {
    return NextResponse.json({ error: "Indica una keyword" }, { status: 400 });
  }
  const type = body.type === "product" ? "product" : "blog";
  const cost =
    type === "blog" ? FEATURE_CREDITS.SEO_CONTENT_BLOG : FEATURE_CREDITS.SEO_CONTENT_PRODUCT;

  try {
    await assertCanAnalyze(session.user.id, cost);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sin créditos" },
      { status: 402 },
    );
  }

  const result = await runContentGenerator({
    userId: session.user.id,
    keyword: body.keyword.trim(),
    type,
    country: body.country,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await prisma.contentGeneration.create({
    data: {
      userId: session.user.id,
      keyword: body.keyword.trim(),
      contentType: type,
      outputJson: result.output as object,
      creditsUsed: cost,
    },
  });

  await recordAnalysisUsage(
    session.user.id,
    type === "blog" ? "seo_content" : "seo_content_product",
    cost,
  );

  return NextResponse.json({ ok: true, output: result.output, creditsUsed: cost });
}
