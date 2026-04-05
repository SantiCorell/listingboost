import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { parseSerpInsightOutput } from "@/lib/serp-insight-output";
import { SerpInsightReportView } from "@/components/seo/serp-insight-report-view";
import { SerpInsightShareToolbar } from "@/components/seo/serp-insight-share-toolbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function SerpInsightHistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [row, viewer] = await Promise.all([
    prisma.serpCompetitorInsightReport.findUnique({ where: { id } }),
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
  ]);

  if (!row) notFound();

  const admin = userIsAdmin(session.user.role, session.user.email);
  if (row.userId !== session.user.id && !admin) notFound();
  if (row.userId === session.user.id && viewer.plan === "FREE" && !admin) {
    redirect("/pricing?reason=history-study");
  }

  const data = parseSerpInsightOutput(row.outputJson);
  const positionLabel =
    row.positionAtRun != null && row.positionAtRun > 0
      ? `Posición orgánica aproximada ~${row.positionAtRun} para «${row.keyword}»`
      : "Sin posición clara en el tramo analizado cuando se generó el informe";

  const filenameBase = `informe-serp-${row.keyword.replace(/\s+/g, "-").slice(0, 40)}-${row.id.slice(0, 8)}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button variant="ghost" size="sm" asChild className="w-fit gap-1">
          <Link href="/dashboard/history#informes-serp">
            <ArrowLeft className="h-4 w-4" />
            Historial
          </Link>
        </Button>
        <SerpInsightShareToolbar
          reportId={row.id}
          data={data}
          keyword={row.keyword}
          pageUrl={row.pageUrl}
          positionLabel={positionLabel}
          filenameBase={filenameBase}
          className="w-full sm:w-auto"
        />
        {row.monitoringId ? (
          <Button variant="outline" size="sm" className="w-full min-h-11 sm:min-h-9 sm:w-auto" asChild>
            <Link href="/dashboard/seo-engine?tab=monitor">Ir al seguimiento SERP</Link>
          </Button>
        ) : null}
      </div>

      <div>
        <h1 className="sr-only">
          Informe SERP vs competidores · {row.keyword}
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(row.createdAt)}
          {row.creditsUsed > 0 ? ` · ${row.creditsUsed} créditos al generar` : " · Sin descuento de cupo en tu plan"}
        </p>
      </div>

      <div className="rounded-xl border border-border/70 bg-card/80 p-6 shadow-sm">
        <SerpInsightReportView
          data={data}
          keyword={row.keyword}
          pageUrl={row.pageUrl}
          positionLabel={positionLabel}
        />
      </div>
    </div>
  );
}
