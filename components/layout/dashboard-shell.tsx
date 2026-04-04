"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, LayoutDashboard, History, PackageSearch, SearchCheck, Settings } from "lucide-react";
import { isCommerceEnabled } from "@/lib/commerce";
import { BrandLogoLink } from "@/components/brand/brand-logo-link";
import { cn } from "@/lib/utils";

const baseLinks = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/product", label: "Boost ficha", icon: PackageSearch },
  { href: "/dashboard/audit", label: "Scan URL", icon: SearchCheck },
  { href: "/dashboard/history", label: "Historial", icon: History },
] as const;

const links = [
  ...baseLinks,
  ...(isCommerceEnabled() ? ([{ href: "/pricing/credits", label: "Créditos", icon: Coins }] as const) : []),
  { href: "/settings", label: "Ajustes", icon: Settings },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row">
      <nav className="flex gap-1 overflow-x-auto pb-1 md:hidden">
        {links.map(({ href, label }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <aside className="hidden w-52 shrink-0 md:block">
        <div className="sticky top-24 space-y-5">
          <BrandLogoLink variant="header" className="w-full flex-col items-start gap-2" />
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
