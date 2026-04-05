import type { Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PLAN_PRICING_DISPLAY } from "@/lib/plans";

const MS_DAY = 24 * 60 * 60 * 1000;

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * MS_DAY);
}

export async function getAdminDashboardStats() {
  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  const [
    usersTotal,
    usersNew7d,
    visitsTotal7d,
    distinctVisitors7d,
    apiLogs7d,
    apiLogsOk7d,
    productAnalysesTotal,
    urlAuditsTotal,
    subscriptionsActive,
    usersByPlan,
    apiByUser,
    recentUsers,
    recentApiLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since7 } } }),
    prisma.siteVisit.count({ where: { createdAt: { gte: since7 } } }),
    prisma.siteVisit
      .groupBy({
        by: ["visitorKey"],
        where: { createdAt: { gte: since7 } },
      })
      .then((rows) => rows.length),
    prisma.apiLog.count({ where: { createdAt: { gte: since7 } } }),
    prisma.apiLog.count({ where: { createdAt: { gte: since7 }, ok: true } }),
    prisma.productAnalysis.count(),
    prisma.urlAudit.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.user.groupBy({
      by: ["plan"],
      _count: { id: true },
    }),
    prisma.apiLog.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: since7 }, userId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        createdAt: true,
        analysesThisMonth: true,
        _count: { select: { productAnalyses: true, urlAudits: true } },
      },
    }),
    prisma.apiLog.findMany({
      where: { createdAt: { gte: since30 } },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true,
        provider: true,
        operation: true,
        ok: true,
        latencyMs: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
  ]);

  const [
    visitsTotal30d,
    distinctVisitors30d,
    visitsTotalAll,
    visitsAuthenticated7d,
    visitsAnonymous7d,
    topPaths7d,
  ] = await Promise.all([
    prisma.siteVisit.count({ where: { createdAt: { gte: since30 } } }),
    prisma.siteVisit
      .groupBy({
        by: ["visitorKey"],
        where: { createdAt: { gte: since30 } },
      })
      .then((rows) => rows.length),
    prisma.siteVisit.count(),
    prisma.siteVisit.count({
      where: { createdAt: { gte: since7 }, userId: { not: null } },
    }),
    prisma.siteVisit.count({
      where: { createdAt: { gte: since7 }, userId: null },
    }),
    prisma.siteVisit.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since7 } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 15,
    }),
  ]);

  const distinctEverRows = await prisma.$queryRaw<{ c: bigint }[]>`
    SELECT COUNT(DISTINCT "visitorKey")::bigint AS c FROM "SiteVisit"
  `;
  const distinctVisitorsEver = Number(distinctEverRows[0]?.c ?? 0);

  const planCounts: Partial<Record<Plan, number>> = {};
  for (const row of usersByPlan) {
    planCounts[row.plan] = row._count.id;
  }

  const freeUsers = planCounts.FREE ?? 0;
  const proUsers = planCounts.PRO ?? 0;
  const proPlusUsers = planCounts.PRO_PLUS ?? 0;

  const mrrEuros =
    proUsers * (PLAN_PRICING_DISPLAY.PRO.euros ?? 0) +
    proPlusUsers * (PLAN_PRICING_DISPLAY.PRO_PLUS.euros ?? 0);

  const apiUserIds = apiByUser.map((r) => r.userId).filter(Boolean) as string[];
  const apiUsers =
    apiUserIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: apiUserIds } },
          select: { id: true, email: true },
        })
      : [];
  const emailByUserId = new Map(apiUsers.map((u) => [u.id, u.email ?? "—"]));

  const apiByUserRows = apiByUser.map((row) => ({
    userId: row.userId as string,
    email: emailByUserId.get(row.userId as string) ?? "—",
    calls: row._count.id,
  }));

  return {
    usersTotal,
    usersNew7d,
    visitsTotal7d,
    distinctVisitors7d,
    visitsTotal30d,
    distinctVisitors30d,
    visitsTotalAll,
    distinctVisitorsEver,
    visitsAuthenticated7d,
    visitsAnonymous7d,
    topPaths7d: topPaths7d.map((row) => ({ path: row.path, views: row._count.id })),
    trafficNote:
      "Cada carga de página cuenta como una vista. Los visitantes únicos usan un ID anónimo en el navegador (localStorage) tras aceptar cookies analíticas; no es un censo perfecto ni sustituye a Google Analytics.",
    apiLogs7d,
    apiLogsOk7d,
    productAnalysesTotal,
    urlAuditsTotal,
    subscriptionsActive,
    planCounts,
    freeUsers,
    mrrEuros,
    mrrNote:
      "Estimación a partir de usuarios con plan Pro / Pro+ y precios de catálogo. Enterprise y Stripe real no incluidos.",
    potentialNote: `Usuarios en plan Free como posible conversión a Pro (${PLAN_PRICING_DISPLAY.PRO.euros} €/mes de referencia).`,
    potentialMrrIfAllFreeConvert: freeUsers * (PLAN_PRICING_DISPLAY.PRO.euros ?? 0),
    apiByUserRows,
    recentUsers,
    recentApiLogs,
  };
}
