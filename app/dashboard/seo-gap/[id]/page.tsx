import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasSeoGapFinder } from "@/lib/plan-features";
import { parseSeoGapOutput } from "@/lib/seo-gap-output";
import { Button } from "@/components/ui/button";
import { SeoGapReportBody } from "@/components/seo/seo-gap-report-body";
import { ArrowLeft } from "lucide-react";

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
        <p className="mt-1 text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleString()}</p>
      </div>

      <SeoGapReportBody data={parsed} />
    </div>
  );
}
