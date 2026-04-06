"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { Plan } from "@prisma/client";
import { BrandLogoLink } from "@/components/brand/brand-logo-link";
import { headerUpsell } from "@/lib/header-upsell";
import { isCommerceEnabled } from "@/lib/commerce";
import { planLabel } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronDown,
  Crown,
  Sparkles,
  LineChart,
  PackageSearch,
  Hash,
  Menu,
  Mail,
  Shield,
  Coins,
  LayoutGrid,
  Building2,
  SearchCheck,
  ScanSearch,
} from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";

type ProductGuide = {
  href: string;
  label: string;
  sub: string;
  Icon: ComponentType<{ className?: string }>;
  /** Destaca visualmente en menú (módulo estrella). */
  featured?: boolean;
};

/** Guías públicas (mismo orden en dropdown y menú móvil). */
const PRODUCT_GUIDES: ProductGuide[] = [
  {
    href: "/producto",
    label: "Centro de producto",
    sub: "Mapa: boost, scan, SEO Engine, SEO Gap, hashtags e inmobiliarias",
    Icon: LayoutGrid,
  },
  {
    href: "/producto/seo-gap-finder",
    label: "SEO Gap Finder AI",
    sub: "SERP real → keywords, gráficos, clusters y acciones (Pro+)",
    Icon: ScanSearch,
    featured: true,
  },
  {
    href: "/producto/boost-de-ficha",
    label: "Boost de ficha",
    sub: "Wallapop, eBay, Shopify, ecommerce",
    Icon: PackageSearch,
  },
  {
    href: "/producto/scan-seo-url",
    label: "Scan SEO de URL",
    sub: "Auditoría on-page y quick wins",
    Icon: LineChart,
  },
  {
    href: "/producto/seo-engine",
    label: "SEO Engine",
    sub: "Contenido, blog, competidor, monitor",
    Icon: Sparkles,
  },
  {
    href: "/producto/hashtags-redes",
    label: "Hashtags para redes",
    sub: "Instagram, TikTok, Shorts",
    Icon: Hash,
  },
  {
    href: "/producto/inmobiliarias",
    label: "Inmobiliarias",
    sub: "Portales y web propia",
    Icon: Building2,
  },
];

function initials(name: string | null | undefined, email: string | null | undefined) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase().slice(0, 2);
  }
  if (email?.trim()) return email[0]!.toUpperCase();
  return "?";
}

function firstName(name: string | null | undefined, email: string | null | undefined) {
  if (name?.trim()) return name.trim().split(/\s+/)[0] ?? name;
  if (email?.trim()) return email.split("@")[0] ?? "Usuario";
  return "Usuario";
}

export function SiteHeader({ googleAuthAvailable }: { googleAuthAvailable: boolean }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<"login" | "register">("login");

  function openAuthModal(tab: "login" | "register") {
    setMobileOpen(false);
    setAuthInitialTab(tab);
    setAuthOpen(true);
  }
  const plan = (session?.user?.plan ?? "FREE") as Plan;
  const commerceEnabled = isCommerceEnabled();
  const upsell = headerUpsell(session?.user?.plan, commerceEnabled);
  const isAdminUser = Boolean(session?.user?.isAdmin);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 shrink items-center gap-1">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
                aria-label="Abrir menú de navegación"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-[min(100vw-1rem,22rem)] flex-col overflow-y-auto">
              <SheetHeader className="space-y-4 text-left">
                <BrandLogoLink variant="sheet" onNavigate={() => setMobileOpen(false)} />
                <SheetTitle className="text-base">Navegación</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 text-sm" aria-label="Principal">
                <p className="px-3 pb-0.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Guías y módulos
                </p>
                <p className="px-3 pb-2 text-xs leading-snug text-muted-foreground">
                  Páginas públicas: qué hace cada parte del producto antes de entrar al panel.
                </p>
                {PRODUCT_GUIDES.map(({ href, label, sub, Icon, featured }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "rounded-lg px-3 py-2.5 hover:bg-accent",
                      featured &&
                        "border border-violet-500/45 bg-gradient-to-br from-violet-500/12 to-fuchsia-500/5 shadow-sm",
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Icon className={cn("h-4 w-4 shrink-0", featured ? "text-violet-600" : "text-primary")} />
                      {label}
                      {featured ? (
                        <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                          Top
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block pl-6 text-xs font-normal text-muted-foreground">{sub}</span>
                  </Link>
                ))}
                <Link
                  href="/#features"
                  className="mt-1 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Cómo funciona (home)
                </Link>
                <p className="mt-4 px-3 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Sitio
                </p>
                <Link
                  href="/blog"
                  className="rounded-lg px-3 py-2.5 font-medium hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-lg px-3 py-2.5 font-medium hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  Precios
                </Link>
                <Link
                  href="/#faq"
                  className="rounded-lg px-3 py-2.5 font-medium hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  href="/contacto"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  <Mail className="h-4 w-4 text-primary" />
                  Contacto
                </Link>
                {session?.user ? (
                  <>
                    <p className="mt-4 px-3 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Tu cuenta
                    </p>
                    <Link
                      href="/dashboard"
                      className="rounded-lg px-3 py-2.5 font-medium hover:bg-accent"
                      onClick={() => setMobileOpen(false)}
                    >
                      Panel
                    </Link>
                    <Link
                      href="/dashboard/product"
                      className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Boost (panel)
                    </Link>
                    <Link
                      href="/dashboard/audit"
                      className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Scan URL (panel)
                    </Link>
                    <Link
                      href="/dashboard/seo-engine"
                      className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      SEO Engine (panel)
                    </Link>
                    <Link
                      href="/dashboard/seo-gap"
                      className="rounded-lg px-3 py-2.5 font-medium text-violet-700 hover:bg-violet-500/10 dark:text-violet-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      SEO Gap AI (panel)
                    </Link>
                    {session.user.isAdmin ? (
                      <p className="rounded-lg px-3 py-2.5 text-sm font-medium text-amber-800 dark:text-amber-200">
                        Uso ilimitado (admin)
                      </p>
                    ) : commerceEnabled ? (
                      <Link
                        href="/pricing/credits"
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-semibold text-primary hover:bg-primary/10"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Coins className="h-4 w-4" />
                        Comprar créditos
                      </Link>
                    ) : (
                      <p className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground">
                        Créditos: próximamente
                      </p>
                    )}
                    {session.user.isAdmin ? (
                      <Link
                        href="/admin"
                        className="rounded-lg px-3 py-2.5 font-medium text-amber-800 hover:bg-amber-500/15 dark:text-amber-200"
                        onClick={() => setMobileOpen(false)}
                      >
                        Admin
                      </Link>
                    ) : null}
                    <Link
                      href="/settings"
                      className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Ajustes
                    </Link>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setMobileOpen(false);
                        void signOut({ redirectTo: "/", redirect: true });
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mt-4 px-3 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Acceso
                    </p>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2.5 text-left font-medium hover:bg-accent"
                      onClick={() => openAuthModal("login")}
                    >
                      Iniciar sesión
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2.5 text-left font-semibold text-primary hover:bg-accent"
                      onClick={() => openAuthModal("register")}
                    >
                      Registrarse
                    </button>
                    <p className="px-3 pt-1 text-xs text-muted-foreground">
                      También puedes usar{" "}
                      <Link href="/login" className="underline underline-offset-2" onClick={() => setMobileOpen(false)}>
                        /login
                      </Link>{" "}
                      si prefieres página completa.
                    </p>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <BrandLogoLink variant="header" />
        </div>

        <nav className="hidden items-center gap-0.5 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                Producto
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={6}
              className="z-[200] max-h-[min(85vh,32rem)] w-[min(100vw-2rem,22rem)] overflow-y-auto p-0 shadow-xl"
            >
              <div className="border-b border-border/70 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 px-3 py-2.5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Producto</p>
                <p className="text-xs text-muted-foreground">
                  Guías públicas por módulo y atajos a tu panel (si has iniciado sesión)
                </p>
              </div>
              <div className="p-1.5">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Guías en la web
                </DropdownMenuLabel>
                {PRODUCT_GUIDES.map(({ href, label, sub, Icon, featured }) => (
                  <DropdownMenuItem
                    key={href}
                    asChild
                    className={cn(
                      "cursor-pointer rounded-lg p-0 focus:bg-transparent",
                      featured && "p-0.5",
                    )}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "flex w-full flex-col gap-0.5 rounded-md px-2 py-2.5 hover:bg-accent",
                        featured &&
                          "border border-violet-500/45 bg-gradient-to-br from-violet-500/12 via-transparent to-fuchsia-500/8 shadow-sm",
                      )}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className={cn("h-4 w-4 shrink-0", featured ? "text-violet-600" : "text-primary")} />
                        {label}
                        {featured ? (
                          <span className="rounded-full bg-amber-500/25 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-100">
                            Top
                          </span>
                        ) : null}
                      </span>
                      <span className="pl-6 text-xs font-normal text-muted-foreground">{sub}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 focus:bg-transparent">
                  <Link href="/#features" className="block rounded-md px-2 py-2 text-sm hover:bg-accent">
                    Cómo funciona (home)
                  </Link>
                </DropdownMenuItem>
                {session?.user ? (
                  <>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Tu cuenta · panel
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 focus:bg-transparent">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        Ir al panel (resumen)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 focus:bg-transparent">
                      <Link
                        href="/dashboard/product"
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                      >
                        <PackageSearch className="h-4 w-4 text-primary" />
                        Ir a Boost (panel)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 focus:bg-transparent">
                      <Link
                        href="/dashboard/audit"
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                      >
                        <SearchCheck className="h-4 w-4 text-primary" />
                        Ir a Scan URL (panel)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 focus:bg-transparent">
                      <Link
                        href="/dashboard/seo-engine"
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                      >
                        <Sparkles className="h-4 w-4 text-primary" />
                        Ir a SEO Engine (panel)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 focus:bg-transparent">
                      <Link
                        href="/dashboard/seo-gap"
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                      >
                        <ScanSearch className="h-4 w-4 text-violet-600" />
                        Ir a SEO Gap AI (panel)
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : null}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/blog">Blog</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/pricing">Precios</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/#faq">FAQ</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/contacto" className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 opacity-70" />
              Contacto
            </Link>
          </Button>
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : session?.user ? (
            <>
              <div className="mr-1 hidden min-w-0 flex-col items-end text-right lg:flex">
                <span className="truncate text-xs text-muted-foreground">
                  Hola,{" "}
                  <span className="font-semibold text-foreground">
                    {firstName(session.user.name, session.user.email)}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className="h-5 px-2 font-mono text-xs font-semibold uppercase tracking-wide"
                  >
                    Plan {planLabel(plan)}
                  </Badge>
                </span>
              </div>
              {!isAdminUser ? (
                upsell.disabled ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="hidden cursor-not-allowed gap-1.5 border-dashed px-3 text-xs text-muted-foreground sm:flex"
                    title={upsell.sub}
                  >
                    <Crown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    <span className="max-w-[9rem] truncate">{upsell.label}</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="hidden gap-1.5 border border-amber-400/35 bg-gradient-to-r from-amber-400/25 via-amber-300/20 to-amber-500/15 px-3 text-amber-950 shadow-sm hover:from-amber-400/35 hover:to-amber-500/25 dark:border-amber-400/25 dark:from-amber-400/15 dark:text-amber-50 sm:flex"
                    asChild
                    title={upsell.sub}
                  >
                    <Link href={upsell.href}>
                      <Crown className="h-3.5 w-3.5 shrink-0" />
                      <span className="max-w-[7rem] truncate text-xs font-semibold sm:max-w-[9rem]">
                        {upsell.label}
                      </span>
                    </Link>
                  </Button>
                )
              ) : null}
              {commerceEnabled && !isAdminUser ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden gap-1 border border-primary/30 bg-gradient-to-r from-primary/10 to-violet-500/10 px-2.5 text-xs font-bold text-primary shadow-sm hover:from-primary/15 hover:to-violet-500/15 sm:flex"
                  asChild
                >
                  <Link href="/pricing/credits">
                    <Coins className="h-3.5 w-3.5" />
                    Créditos
                  </Link>
                </Button>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border/80 pl-2 pr-2 sm:pr-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary ring-1 ring-primary/15">
                      {initials(session.user.name, session.user.email)}
                    </span>
                    <span className="hidden max-w-[100px] truncate text-left text-sm lg:inline">
                      {session.user.name ?? session.user.email ?? "Cuenta"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name ?? "Usuario"}
                      </p>
                      {session.user.email ? (
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      ) : null}
                      <p className="pt-1 font-mono text-xs uppercase tracking-wide text-primary">
                        Plan {planLabel(plan)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/product" className="cursor-pointer">
                      <PackageSearch className="h-4 w-4" />
                      Boost de ficha
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/audit" className="cursor-pointer">
                      <SearchCheck className="h-4 w-4" />
                      Scan URL
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/seo-engine" className="cursor-pointer">
                      <Sparkles className="h-4 w-4" />
                      SEO Engine
                    </Link>
                  </DropdownMenuItem>
                  {commerceEnabled && !isAdminUser ? (
                    <DropdownMenuItem asChild>
                      <Link href="/pricing/credits" className="cursor-pointer font-semibold text-primary">
                        <Coins className="h-4 w-4" />
                        Comprar créditos
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Ajustes
                    </Link>
                  </DropdownMenuItem>
                  {session.user.isAdmin ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-amber-800 dark:text-amber-300">
                        <Shield className="h-4 w-4" />
                        Administración
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  {!isAdminUser ? (
                    <>
                      <DropdownMenuSeparator />
                      {upsell.disabled ? (
                        <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
                          <Crown className="h-4 w-4" />
                          {upsell.label}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link href={upsell.href} className="cursor-pointer font-medium text-amber-700 dark:text-amber-400">
                            <Crown className="h-4 w-4" />
                            {upsell.label}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => {
                      void signOut({ redirectTo: "/", redirect: true });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="hidden gap-1.5 border-amber-400/40 bg-amber-400/10 px-2.5 text-amber-950 hover:bg-amber-400/20 dark:border-amber-400/30 dark:text-amber-100 sm:flex"
                asChild
              >
                <Link href="/pricing">
                  <Crown className="h-3.5 w-3.5" />
                  Planes Pro
                </Link>
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => openAuthModal("login")}>
                Iniciar sesión
              </Button>
              <Button
                size="sm"
                type="button"
                className="border border-primary/15 bg-gradient-to-r from-primary to-primary/90 shadow-md shadow-primary/20"
                onClick={() => openAuthModal("register")}
              >
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        googleAuthAvailable={googleAuthAvailable}
        initialTab={authInitialTab}
      />
    </header>
  );
}
