import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { UrlAuditResults } from "@/components/url/url-audit-results";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown } from "lucide-react";

export default async function AuditHistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [audit, viewer] = await Promise.all([
    prisma.urlAudit.findUnique({ where: { id } }),
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
  ]);

  if (!audit) notFound();

  const admin = userIsAdmin(session.user.role, session.user.email);
  if (audit.userId !== session.user.id && !admin) notFound();
  if (audit.userId === session.user.id && viewer.plan === "FREE" && !admin) {
    redirect("/pricing?reason=history-study");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/dashboard/history">
            <ArrowLeft className="h-4 w-4" />
            Historial
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="gap-1">
          <Link href={`/dashboard/history/audit/${id}/print`} target="_blank">
            <FileDown className="h-4 w-4" />
            Informe imprimible / PDF
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Auditoría SEO</h1>
        <p className="mt-1 break-all text-sm text-muted-foreground">{audit.url}</p>
        <p className="text-xs text-muted-foreground">
          {audit.createdAt.toLocaleString("es-ES")} · {audit.pageType}
        </p>
      </div>
      <UrlAuditResults output={audit.outputJson} auditId={id} />
    </div>
  );
}
