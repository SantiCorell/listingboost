import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { userIsAdmin } from "@/lib/auth/admin";
import { AdminSessionStrip } from "@/components/admin/admin-session-strip";
import { getSessionIdleMinutesRounded } from "@/lib/session-config";
import { LayoutDashboard, Shield } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }
  if (!userIsAdmin(session.user.role ?? "USER", session.user.email)) {
    redirect("/dashboard");
  }

  const idleMinutes = getSessionIdleMinutesRounded();

  return (
    <div className="min-h-[40vh] border-b border-amber-500/30 bg-gradient-to-b from-amber-500/[0.12] via-amber-500/[0.06] to-background dark:from-amber-500/15 dark:via-amber-500/10">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/35 bg-amber-500/15 text-amber-900 shadow-sm dark:text-amber-100">
              <Shield className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold tracking-tight text-amber-950 dark:text-amber-50">
                Administración
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session.user.email ?? session.user.name ?? "Cuenta admin"}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-background/80 px-3 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Volver al panel
          </Link>
        </div>
        <AdminSessionStrip initialExpires={session.expires} idleMinutes={idleMinutes} />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-2 sm:px-6">{children}</div>
    </div>
  );
}
