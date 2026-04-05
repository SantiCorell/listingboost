import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasSeoGapFinder } from "@/lib/plan-features";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardStripeReturnSync } from "@/components/dashboard/dashboard-stripe-return-sync";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let showSeoGapFinder = false;
  if (session?.user?.id) {
    const u = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, role: true, email: true },
    });
    showSeoGapFinder = Boolean(u && (userIsAdmin(u.role, u.email) || hasSeoGapFinder(u.plan)));
  }

  return (
    <DashboardShell showSeoGapFinder={showSeoGapFinder}>
      <Suspense fallback={null}>
        <DashboardStripeReturnSync />
      </Suspense>
      {children}
    </DashboardShell>
  );
}
