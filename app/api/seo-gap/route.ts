import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasSeoGapFinder } from "@/lib/plan-features";
import { hasUnlimitedMonthlyCredits } from "@/lib/plans";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { runSeoGapFinder, seoGapCacheKey } from "@/services/seo/seo-gap-finder";

export const runtime = "nodejs";
export const maxDuration = 300;

const COST = FEATURE_CREDITS.SEO_GAP_FINDER;

function parseParams(url: URL) {
  const keyword = url.searchParams.get("keyword")?.trim() ?? "";
  const domain = url.searchParams.get("domain")?.trim() || null;
  const country = url.searchParams.get("country")?.trim() || "es";
  const language = url.searchParams.get("language")?.trim() || "es";
  return { keyword, domain: domain || null, country, language };
}

async function handle(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let keyword: string;
    let domain: string | null;
    let country: string;
    let language: string;

    if (req.method === "POST") {
      let body: Record<string, unknown>;
      try {
        body = (await req.json()) as Record<string, unknown>;
      } catch {
        return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
      }
      keyword = String(body.keyword ?? "").trim();
      const d = body.domain;
      domain = typeof d === "string" && d.trim() ? d.trim() : null;
      country = String(body.country ?? "es").trim() || "es";
      language = String(body.language ?? "es").trim() || "es";
    } else {
      const u = new URL(req.url);
      ({ keyword, domain, country, language } = parseParams(u));
    }

    if (!keyword) {
      return NextResponse.json({ error: "Falta keyword" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, role: true, email: true },
    });
    const admin = userIsAdmin(user?.role, user?.email);
    if (!user || (!admin && !hasSeoGapFinder(user.plan))) {
      return NextResponse.json(
        { error: "SEO Gap Finder AI requiere plan Pro+ o Enterprise." },
        { status: 403 },
      );
    }

    const cacheKey = seoGapCacheKey({ keyword, domain, country, language });
    const since = new Date(Date.now() - 86_400_000);

    const cached = await prisma.seoGapReport.findFirst({
      where: {
        userId: session.user.id,
        cacheKey,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, outputJson: true },
    });

    if (cached) {
      return NextResponse.json({
        ok: true,
        output: cached.outputJson,
        reportId: cached.id,
        creditsUsed: 0,
        cached: true,
      });
    }

    try {
      await assertCanAnalyze(session.user.id, COST);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Sin créditos" },
        { status: 402 },
      );
    }

    const result = await runSeoGapFinder({
      userId: session.user.id,
      keyword,
      domain,
      country,
      language,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    const charged = admin || hasUnlimitedMonthlyCredits(user.plan) ? 0 : COST;
    await recordAnalysisUsage(session.user.id, "seo_gap_finder");

    const saved = await prisma.seoGapReport.create({
      data: {
        userId: session.user.id,
        keyword,
        domain,
        country,
        language,
        creditsUsed: charged,
        cacheKey,
        outputJson: result.data as object,
      },
      select: { id: true },
    });

    return NextResponse.json({
      ok: true,
      output: result.data,
      reportId: saved.id,
      creditsUsed: charged,
      cached: false,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") {
      return NextResponse.json(
        {
          error:
            "Falta la tabla SeoGapReport en la base de datos. En local: npm run db:push. " +
            "En producción: npx prisma migrate deploy, o ejecuta supabase/sql/add_seo_gap_report.sql en el SQL Editor.",
        },
        { status: 503 },
      );
    }
    console.error("[api/seo-gap]", e);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return handle(req);
}

/** Misma lógica que POST; útil para enlaces o integraciones (keyword en query). */
export async function GET(req: Request) {
  return handle(req);
}
