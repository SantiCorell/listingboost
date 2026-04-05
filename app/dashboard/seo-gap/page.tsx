import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasSeoGapFinder } from "@/lib/plan-features";
import { SeoGapFinderClient } from "@/components/seo/seo-gap-finder-client";
import { ScanSearch } from "lucide-react";

export default async function SeoGapDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/seo-gap");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  const admin = userIsAdmin(user?.role, user?.email);
  if (!admin && !hasSeoGapFinder(user?.plan ?? "FREE")) {
    redirect("/dashboard?upgrade=seo_gap");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <ScanSearch className="h-4 w-4" />
          SEO Gap Finder AI
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Oportunidades que la SERP ya validó</h1>
        <p className="max-w-2xl text-muted-foreground">
          Comparamos Google en vivo con lo que rankean los competidores y, si quieres, con tu dominio. El resultado son
          acciones ordenadas por impacto: qué crear, con qué título y qué URL.
        </p>
      </div>
      <SeoGapFinderClient />
    </div>
  );
}
