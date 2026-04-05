"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Coins,
  LayoutDashboard,
  History,
  PackageSearch,
  ScanSearch,
  SearchCheck,
  Settings,
  Sparkles,
} from "lucide-react";
import { isCommerceEnabled } from "@/lib/commerce";
import { BrandLogoLink } from "@/components/brand/brand-logo-link";
import { cn } from "@/lib/utils";

type DashLink = { href: string; label: string; icon: LucideIcon };

const toolLinksBase: readonly DashLink[] = [
  { href: "/dashboard/product", label: "Boost ficha", icon: PackageSearch },
  { href: "/dashboard/audit", label: "Scan URL", icon: SearchCheck },
  { href: "/dashboard/seo-engine", label: "SEO Engine", icon: Sparkles },
];

const seoGapLink: DashLink = {
  href: "/dashboard/seo-gap",
  label: "SEO Gap AI",
  icon: ScanSearch,
};

function accountLinks(): DashLink[] {
  const credits: DashLink[] = isCommerceEnabled()
    ? [{ href: "/pricing/credits", label: "Créditos", icon: Coins }]
    : [];
  return [
    { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
    { href: "/dashboard/history", label: "Historial", icon: History },
    ...credits,
    { href: "/settings", label: "Ajustes", icon: Settings },
  ];
}

function linkActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

function NavLinkButton({
  href,
  label,
  icon: Icon,
  pathname,
  compact,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  pathname: string;
  compact?: boolean;
}) {
  const active = linkActive(pathname, href);
  return (
    <Link
      href={href}
      className={cn(
        compact
          ? "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
          : "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? compact
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
          : compact
            ? "bg-muted text-muted-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {!compact ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {label}
    </Link>
  );
}

export function DashboardShell({
  children,
  showSeoGapFinder = false,
}: {
  children: React.ReactNode;
  /** Pro+ / Enterprise / admin: enlace a SEO Gap Finder AI. */
  showSeoGapFinder?: boolean;
}) {
  const pathname = usePathname();
  const secondary = accountLinks();
  const toolLinks: readonly DashLink[] = showSeoGapFinder ? [...toolLinksBase, seoGapLink] : toolLinksBase;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row">
      <nav className="space-y-4 md:hidden">
        <div>
          <p className="mb-2 px-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Herramientas
          </p>
          <p className="mb-2 text-[11px] leading-snug text-muted-foreground/90">
            Optimiza fichas, audita URLs y usa el motor SEO.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {toolLinks.map(({ href, label, icon }) => (
              <NavLinkButton
                key={href}
                href={href}
                label={label}
                icon={icon}
                pathname={pathname}
                compact
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 px-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Cuenta y actividad
          </p>
          <p className="mb-2 text-[11px] leading-snug text-muted-foreground/90">
            Resumen, historial, créditos y ajustes.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {secondary.map(({ href, label, icon }) => (
              <NavLinkButton
                key={href}
                href={href}
                label={label}
                icon={icon}
                pathname={pathname}
                compact
              />
            ))}
          </div>
        </div>
      </nav>

      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24 space-y-6">
          <BrandLogoLink variant="header" className="w-full flex-col items-start gap-2" />
          <nav className="space-y-6">
            <div>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Herramientas
              </p>
              <p className="mb-2 px-3 text-[11px] leading-snug text-muted-foreground/90">
                Lo que puedes usar para trabajar el SEO de tus fichas.
              </p>
              <div className="space-y-1">
                {toolLinks.map(({ href, label, icon }) => (
                  <NavLinkButton key={href} href={href} label={label} icon={icon} pathname={pathname} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Cuenta y actividad
              </p>
              <p className="mb-2 px-3 text-[11px] leading-snug text-muted-foreground/90">
                Navega por tu espacio: resumen, historial y ajustes.
              </p>
              <div className="space-y-1">
                {secondary.map(({ href, label, icon }) => (
                  <NavLinkButton key={href} href={href} label={label} icon={icon} pathname={pathname} />
                ))}
              </div>
            </div>
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
