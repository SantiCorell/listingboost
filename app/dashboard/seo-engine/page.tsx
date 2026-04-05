import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasGrowthAutomation, hasSeoMonitoring } from "@/lib/plan-features";
import { isPaidPlan, isProPlusOrHigher } from "@/lib/plans";
import { APP_NAME } from "@/lib/constants";
import { SeoEngineWorkbench } from "@/components/seo/seo-engine-workbench";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata = {
  title: "SEO Engine",
};

const VALID_TABS = ["content", "blog", "competitor", "monitor"] as const;

export default async function SeoEnginePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const tabParam = sp.tab?.toLowerCase();
  const defaultTab = VALID_TABS.includes(tabParam as (typeof VALID_TABS)[number])
    ? (tabParam as (typeof VALID_TABS)[number])
    : "content";

  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/seo-engine");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  const plan = user?.plan ?? "FREE";
  const isAdmin = userIsAdmin(user?.role, user?.email);
  const competitorPdfExportFree = isAdmin || isProPlusOrHigher(plan);

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" className="mb-4 gap-2 px-0 text-muted-foreground" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>
        </Button>
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SEO Growth Engine</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Genera contenido, optimiza blogs, compara con competidores y (en Pro) monitoriza posiciones. Todo en{" "}
              {APP_NAME} con el mismo sistema de créditos.
            </p>
          </div>
        </div>
      </div>

      <SeoEngineWorkbench
        defaultTab={defaultTab}
        monitoringLocked={!isAdmin && !hasSeoMonitoring(plan)}
        competitorLocked={!isAdmin && !isPaidPlan(plan)}
        allowDailyMonitoring={isAdmin || hasGrowthAutomation(plan)}
        competitorPdfExportFree={competitorPdfExportFree}
      />
    </div>
  );
}
