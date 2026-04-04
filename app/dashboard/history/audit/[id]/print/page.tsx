import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { UrlAuditPrintClient } from "@/components/url/url-audit-print-client";

export default async function AuditPrintPage({
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
    <div className="min-h-screen bg-white text-black print:p-8">
      <UrlAuditPrintClient
        url={audit.url}
        createdAt={audit.createdAt.toISOString()}
        pageType={audit.pageType}
        output={audit.outputJson}
      />
    </div>
  );
}
