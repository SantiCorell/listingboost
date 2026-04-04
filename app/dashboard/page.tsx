import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { isCommerceEnabled } from "@/lib/commerce";
import { resetMonthlyUsageIfNeeded } from "@/lib/usage";
import { monthlyIncludedLimit } from "@/lib/plans";
import { planLabel } from "@/lib/plans";
import { DashboardAccountHero } from "@/components/dashboard/dashboard-account-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LineChart, PackageSearch } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });
  user = await resetMonthlyUsageIfNeeded(user);

  const limit = monthlyIncludedLimit(user.plan);
  const commerceEnabled = isCommerceEnabled();
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Usuario";
  const isAdmin = Boolean(session.user.isAdmin);

  const [recentProducts, recentAudits] = await Promise.all([
    prisma.productAnalysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.urlAudit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-10">
      <DashboardAccountHero
        displayName={displayName}
        email={user.email}
        plan={user.plan}
        analysesThisMonth={user.analysesThisMonth}
        monthlyLimit={limit}
        bonusCreditsRemaining={user.bonusCreditsRemaining}
        commerceEnabled={commerceEnabled}
        isAdmin={isAdmin}
      />

      <div>
        <h2 className="text-lg font-semibold tracking-tight">Resumen rápido</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAdmin ? (
            <>
              Cuenta <span className="font-medium text-foreground">administrador</span> · uso ilimitado en la plataforma.
            </>
          ) : (
            <>
              Plan <span className="font-medium text-foreground">{planLabel(user.plan)}</span> · mismas acciones en
              formato compacto.
            </>
          )}
        </p>
      </div>

      <div
        className={
          isAdmin ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        }
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-base font-semibold">
                {planLabel(user.plan)}
              </Badge>
              {!isAdmin && user.plan === "FREE" && commerceEnabled ? (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/pricing">Mejorar plan</Link>
                </Button>
              ) : !isAdmin && user.plan === "PRO" && commerceEnabled ? (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/pricing">Subir a Pro+</Link>
                </Button>
              ) : !isAdmin && user.plan === "FREE" && !commerceEnabled ? (
                <span className="text-xs text-muted-foreground">Pagos próximamente</span>
              ) : null}
            </div>
          </CardContent>
        </Card>
        {!isAdmin ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Incluidos este mes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">
                  {user.analysesThisMonth}
                  <span className="text-lg font-normal text-muted-foreground"> / {limit}</span>
                </p>
                <p className="text-xs text-muted-foreground">Cupo del plan (se renueva cada mes)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Créditos extra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">{user.bonusCreditsRemaining}</p>
                {commerceEnabled ? (
                  <Button size="sm" variant="link" className="h-auto p-0 text-xs font-semibold" asChild>
                    <Link href="/pricing/credits">Comprar créditos</Link>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Créditos: próximamente</span>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
        <Card className={isAdmin ? "sm:col-span-1" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acciones</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild className="h-11 w-full justify-between sm:h-9" size="sm">
              <Link href="/dashboard/product">
                <span className="flex items-center gap-2">
                  <PackageSearch className="h-4 w-4" />
                  Boost ficha
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="h-11 w-full justify-between sm:h-9" size="sm">
              <Link href="/dashboard/audit">
                <span className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Scan URL
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos análisis de producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay análisis.</p>
            ) : (
              recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm"
                >
                  <span className="truncate text-muted-foreground">
                    {formatDate(p.createdAt)} · {p.platformTarget}
                  </span>
                  <Badge variant="outline">{p.language}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimas auditorías URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAudits.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay auditorías.</p>
            ) : (
              recentAudits.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm"
                >
                  <span className="truncate text-muted-foreground">{u.url}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(u.createdAt)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
