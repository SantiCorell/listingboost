import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { userIsAdmin } from "@/lib/auth/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }
  if (!userIsAdmin(session.user.role ?? "USER", session.user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[40vh] border-b border-amber-500/25 bg-amber-500/[0.07] dark:bg-amber-500/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6">
        <p className="font-semibold tracking-tight text-amber-950 dark:text-amber-100">
          Panel de administración
        </p>
        <Link
          href="/dashboard"
          className="rounded-md text-primary underline-offset-4 hover:underline"
        >
          Volver al producto
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6">{children}</div>
    </div>
  );
}
