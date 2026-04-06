import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { historyTake } from "@/lib/usage";
import { canOpenSavedStudy } from "@/lib/history-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditsUpsellBanner } from "@/components/pricing/credits-upsell-banner";
import { FREE_HISTORY_LIMIT } from "@/lib/constants";
import { BarChart3, ChevronRight, LineChart, Lock, ScanSearch, Search } from "lucide-react";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sp = await searchParams;
  const rawQ = sp.q;
  const q =
    (typeof rawQ === "string" ? rawQ : Array.isArray(rawQ) ? rawQ[0] : "").trim() ?? "";
  const qFilter = q.length > 0;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });
  const take = historyTake(user.plan, session.user.role, session.user.email);
  const freeListCap = take ?? FREE_HISTORY_LIMIT;

  const mode = "insensitive" as Prisma.QueryMode;

  const productWhere: Prisma.ProductAnalysisWhereInput = {
    userId: user.id,
    ...(qFilter ? { descriptionInput: { contains: q, mode } } : {}),
  };
  const auditWhere: Prisma.UrlAuditWhereInput = {
    userId: user.id,
    ...(qFilter ? { url: { contains: q, mode } } : {}),
  };
  const monitoringWhere: Prisma.SeoMonitoringWhereInput = {
    userId: user.id,
    ...(qFilter
      ? {
          OR: [{ url: { contains: q, mode } }, { keyword: { contains: q, mode } }],
        }
      : {}),
  };
  const serpInsightWhere: Prisma.SerpCompetitorInsightReportWhereInput = {
    userId: user.id,
    ...(qFilter
      ? {
          OR: [{ keyword: { contains: q, mode } }, { pageUrl: { contains: q, mode } }],
        }
      : {}),
  };
  const seoGapWhere: Prisma.SeoGapReportWhereInput = {
    userId: user.id,
    ...(qFilter
      ? {
          OR: [{ keyword: { contains: q, mode } }, { domain: { contains: q, mode } }],
        }
      : {}),
  };

  const [products, audits, monitorings, serpInsightReports, seoGapReports] = await Promise.all([
    prisma.productAnalysis.findMany({
      where: productWhere,
      orderBy: { createdAt: "desc" },
      take: take ?? 500,
    }),
    prisma.urlAudit.findMany({
      where: auditWhere,
      orderBy: { createdAt: "desc" },
      take: take ?? 500,
    }),
    prisma.seoMonitoring.findMany({
      where: monitoringWhere,
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        url: true,
        keyword: true,
        cadence: true,
        lastPosition: true,
        createdAt: true,
      },
    }),
    prisma.serpCompetitorInsightReport.findMany({
      where: serpInsightWhere,
      orderBy: { createdAt: "desc" },
      take: take ?? 200,
      select: {
        id: true,
        keyword: true,
        pageUrl: true,
        positionAtRun: true,
        createdAt: true,
      },
    }),
    prisma.seoGapReport.findMany({
      where: seoGapWhere,
      orderBy: { createdAt: "desc" },
      take: take ?? 200,
      select: {
        id: true,
        keyword: true,
        domain: true,
        country: true,
        language: true,
        creditsUsed: true,
        createdAt: true,
      },
    }),
  ]);

  const canOpen = canOpenSavedStudy(user.plan, session.user.role, session.user.email);

  return (
    <div className="space-y-8">
      <CreditsUpsellBanner />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Historial</h1>
          <p className="text-sm text-muted-foreground">
            {user.plan === "FREE"
              ? `Últimos ${freeListCap} elementos en Free. Los estudios guardados se abren con Pro.`
              : "Historial completo: boosts, auditorías URL, informes SERP premium, SEO Gap AI y seguimientos."}
          </p>
        </div>
        {user.plan === "FREE" ? (
          <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
            Pasar a Pro
          </Link>
        ) : null}
      </div>

      <div className="flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-center">
        <form
          action="/dashboard/history"
          method="get"
          className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center"
          role="search"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Buscar por keyword o URL (boosts, auditorías, SEO Gap, SERP…)"
              className="pl-9"
              autoComplete="off"
              aria-label="Filtrar historial por keyword o URL"
            />
          </div>
          <Button type="submit" variant="secondary" className="shrink-0">
            Buscar
          </Button>
        </form>
        {qFilter ? (
          <Button variant="ghost" className="shrink-0" asChild>
            <Link href="/dashboard/history">Limpiar</Link>
          </Button>
        ) : null}
      </div>
      {qFilter ? (
        <p className="text-sm text-muted-foreground">
          Filtro activo: «{q}». Se aplican a productos, URLs auditadas, SEO Gap, informes SERP y seguimientos.
        </p>
      ) : null}

      {!canOpen ? (
        <p className="rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <Lock className="mb-1 inline h-4 w-4 text-primary" aria-hidden /> Con plan Free ves el listado, pero
          no puedes abrir el detalle del análisis. Sube a Pro para recuperar títulos, copys y auditorías
          completas.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Productos (boost de ficha)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin registros.</p>
          ) : (
            products.map((p) =>
              canOpen ? (
                <Link
                  key={p.id}
                  href={`/dashboard/history/product/${p.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <span className="text-muted-foreground">{formatDate(p.createdAt)}</span>
                  <Badge variant="secondary">{p.platformTarget}</Badge>
                  <span className="min-w-0 flex-1 text-xs text-muted-foreground">
                    {(p.descriptionInput ?? "Sin descripción").slice(0, 100)}
                    {(p.descriptionInput?.length ?? 0) > 100 ? "…" : ""}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ) : (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{formatDate(p.createdAt)}</span>
                  <Badge variant="secondary">{p.platformTarget}</Badge>
                  <span className="min-w-0 flex-1 text-xs text-muted-foreground">
                    {(p.descriptionInput ?? "").slice(0, 80)}
                    {(p.descriptionInput?.length ?? 0) > 80 ? "…" : ""}
                  </span>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Lock className="h-3 w-3" />
                    Pro
                  </Badge>
                </div>
              ),
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">URLs (auditoría SEO)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {audits.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin registros.</p>
          ) : (
            audits.map((u) =>
              canOpen ? (
                <Link
                  key={u.id}
                  href={`/dashboard/history/audit/${u.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <span className="min-w-0 flex-1 break-all text-foreground">{u.url}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(u.createdAt)} · {u.pageType}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ) : (
                <div
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-3 text-sm"
                >
                  <span className="min-w-0 flex-1 break-all text-muted-foreground">{u.url}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(u.createdAt)} · {u.pageType}
                  </span>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Lock className="h-3 w-3" />
                    Pro
                  </Badge>
                </div>
              ),
            )
          )}
        </CardContent>
      </Card>

      <Card id="seo-gap-informes" className="scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-base">SEO Gap Finder AI</CardTitle>
          <p className="text-sm text-muted-foreground">
            Informes guardados desde{" "}
            <Link href="/dashboard/seo-gap" className="font-medium text-primary hover:underline">
              SEO Gap AI
            </Link>{" "}
            (Pro+ / Enterprise). Incluyen gráficos, resumen ejecutivo y oportunidades priorizadas.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {seoGapReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay informes.{" "}
              <Link href="/dashboard/seo-gap" className="font-medium text-primary hover:underline">
                Generar uno
              </Link>
              .
            </p>
          ) : (
            seoGapReports.map((r) =>
              canOpen ? (
                <Link
                  key={r.id}
                  href={`/dashboard/seo-gap/${r.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <ScanSearch className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-foreground">«{r.keyword}»</span>
                      <span className="block text-xs text-muted-foreground">
                        {r.domain ?? "sin dominio propio"} · {r.country}/{r.language}
                        {r.creditsUsed > 0 ? ` · ${r.creditsUsed} cr` : " · caché / sin cargo"}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ) : (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-3 text-sm"
                >
                  <span className="text-muted-foreground">«{r.keyword}»</span>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Lock className="h-3 w-3" />
                    Pro
                  </Badge>
                </div>
              ),
            )
          )}
        </CardContent>
      </Card>

      <Card id="informes-serp" className="scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-base">Informes SERP vs competidores</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cada vez que generas el informe premium desde{" "}
            <Link href="/dashboard/seo-engine?tab=monitor" className="font-medium text-primary hover:underline">
              Monitor
            </Link>
            , se guarda aquí. Puedes volver a leerlo o exportarlo a PDF (1 crédito) desde el detalle.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {serpInsightReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay informes.{" "}
              <Link href="/dashboard/seo-engine?tab=monitor" className="font-medium text-primary hover:underline">
                Generar uno en Monitor
              </Link>
              .
            </p>
          ) : (
            serpInsightReports.map((r) =>
              canOpen ? (
                <Link
                  key={r.id}
                  href={`/dashboard/history/serp-insight/${r.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <BarChart3 className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-foreground">«{r.keyword}»</span>
                      <span className="block break-all text-xs text-muted-foreground">{r.pageUrl}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(r.createdAt)}
                    {r.positionAtRun != null ? ` · Pos. ~${r.positionAtRun}` : ""}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ) : (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-3 text-sm"
                >
                  <span className="text-muted-foreground">«{r.keyword}»</span>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Lock className="h-3 w-3" />
                    Pro
                  </Badge>
                </div>
              ),
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seguimiento de posiciones (Google)</CardTitle>
          <p className="text-sm text-muted-foreground">
            URLs y consultas que vigilas en la pestaña <strong className="text-foreground">Monitor</strong> del{" "}
            <Link href="/dashboard/seo-engine?tab=monitor" className="font-medium text-primary hover:underline">
              SEO Engine
            </Link>
            . Ahí ves posiciones y cadencia; aquí queda el listado rápido.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {monitorings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay seguimientos.{" "}
              <Link href="/dashboard/seo-engine?tab=monitor" className="font-medium text-primary hover:underline">
                Crear uno en Monitor
              </Link>
              .
            </p>
          ) : (
            monitorings.map((m) => (
              <Link
                key={m.id}
                href="/dashboard/seo-engine?tab=monitor"
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <LineChart className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block break-all font-medium text-foreground">{m.url}</span>
                    <span className="text-xs text-muted-foreground">
                      Consulta: «{m.keyword}» · {m.cadence === "daily" ? "Diario" : "Semanal"}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(m.createdAt)}
                  {m.lastPosition != null ? (
                    <>
                      {" "}
                      · Pos. ~{m.lastPosition}
                    </>
                  ) : (
                    " · Pos. pendiente"
                  )}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
