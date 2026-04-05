import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasSeoGapFinder } from "@/lib/plan-features";
import { parseSeoGapOutput } from "@/lib/seo-gap-output";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SeoGapIntentChart, SeoGapLevelChart, SeoGapScoreBars } from "@/components/seo/seo-gap-charts";
import { ArrowLeft } from "lucide-react";

const LEVEL_BADGE: Record<string, string> = {
  alta: "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
  media: "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100",
  baja: "border-border bg-muted/50 text-muted-foreground",
};

export default async function SeoGapReportPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  const admin = userIsAdmin(user?.role, user?.email);
  if (!admin && !hasSeoGapFinder(user?.plan ?? "FREE")) redirect("/dashboard");

  const { id } = await params;
  const report = await prisma.seoGapReport.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!report) notFound();

  const parsed = parseSeoGapOutput(report.outputJson);
  if (!parsed) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/dashboard/seo-gap">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Informe SEO Gap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{report.keyword}</span>
          {report.domain ? ` · ${report.domain}` : ""} · {report.country}/{report.language}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(report.createdAt).toLocaleString()}
        </p>
      </div>

      <Card className="border-violet-200/50 bg-violet-500/[0.04] dark:border-violet-500/20 dark:bg-violet-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resumen ejecutivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {parsed.executiveSummary}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <SeoGapIntentChart opportunities={parsed.opportunities} />
        <SeoGapLevelChart opportunities={parsed.opportunities} />
        <div className="lg:col-span-1">
          <SeoGapScoreBars opportunities={parsed.opportunities} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Oportunidades</CardTitle>
          <CardDescription>Prioridad por score.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {parsed.opportunities.map((o, i) => (
            <div
              key={`${o.keyword}-${i}`}
              className="rounded-xl border border-border/70 bg-muted/10 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{o.keyword}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {o.cluster} · <span className="capitalize">{o.type}</span> · {o.score}
                  </p>
                </div>
                <Badge className={LEVEL_BADGE[o.opportunityLevel] ?? ""}>{o.opportunityLevel}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{o.action}</p>
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Título:</span>{" "}
                <strong>{o.title}</strong>
              </p>
              <p className="mt-1 font-mono text-xs text-primary">{o.url}</p>
              <Button asChild size="sm" className="mt-3">
                <Link href={`/dashboard/seo-engine?tab=content&kw=${encodeURIComponent(o.keyword)}`}>
                  Generar página
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
