import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardStripeReturnSync } from "@/components/dashboard/dashboard-stripe-return-sync";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <Suspense fallback={null}>
        <DashboardStripeReturnSync />
      </Suspense>
      {children}
    </DashboardShell>
  );
}
