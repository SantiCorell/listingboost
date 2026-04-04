import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { ProductSeoResults } from "@/components/product/product-seo-results";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ProductHistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [analysis, viewer] = await Promise.all([
    prisma.productAnalysis.findUnique({ where: { id } }),
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
  ]);

  if (!analysis) notFound();

  const admin = userIsAdmin(session.user.role, session.user.email);
  if (analysis.userId !== session.user.id && !admin) notFound();
  if (analysis.userId === session.user.id && viewer.plan === "FREE" && !admin) {
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
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Boost de ficha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resultado guardado · {analysis.platformTarget} · {analysis.createdAt.toLocaleString("es-ES")}
        </p>
      </div>
      <ProductSeoResults output={analysis.outputJson} userPlan={viewer.plan} />
    </div>
  );
}
