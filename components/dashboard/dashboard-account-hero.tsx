"use client";

import Link from "next/link";
import type { Plan } from "@prisma/client";
import { planLabel } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CREDIT_COST_URL_AUDIT } from "@/lib/usage";
import { ArrowRight, Coins, Crown, LineChart, PackageSearch, Sparkles, Zap } from "lucide-react";

function initials(name: string | null, email: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase().slice(0, 2);
  }
  if (email?.trim()) return email[0]!.toUpperCase();
  return "?";
}

export function DashboardAccountHero({
  displayName,
  email,
  plan,
  analysesThisMonth,
  monthlyLimit,
  bonusCreditsRemaining,
  commerceEnabled,
}: {
  displayName: string;
  email: string | null;
  plan: Plan;
  analysesThisMonth: number;
  monthlyLimit: number;
  bonusCreditsRemaining: number;
  /** Pagos Stripe (planes + créditos). */
  commerceEnabled: boolean;
}) {
  const used = analysesThisMonth;
  const limit = monthlyLimit;
  /** `used` / `limit` son unidades de cupo (boost = 1, scan URL = 2). */
  const includedLeft = Math.max(0, limit - used);
  const pctUsed = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const totalCreditsAvailable = includedLeft + bonusCreditsRemaining;
  const isPaid = plan !== "FREE";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.12] via-card to-violet-500/[0.08] p-6 shadow-xl shadow-primary/10 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-gradient-to-br from-primary to-primary/80 text-xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
            {initials(displayName, email)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{displayName}</h2>
              {isPaid ? (
                <Badge className="gap-1 border border-amber-400/40 bg-gradient-to-r from-amber-400/90 to-amber-500 text-amber-950 shadow-sm">
                  <Crown className="h-3 w-3" />
                  Plan {planLabel(plan)}
                </Badge>
              ) : (
                <Badge variant="secondary" className="font-mono text-xs">
                  Plan {planLabel(plan)}
                </Badge>
              )}
            </div>
            {email ? (
              <p className="mt-1 truncate text-sm text-muted-foreground" title={email}>
                {email}
              </p>
            ) : null}
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Tu cupo mensual son <strong className="text-foreground">{limit} créditos</strong> incluidos (llevas{" "}
              <strong className="text-foreground">{used}</strong> consumidos). Te quedan{" "}
              <strong className="text-foreground">{includedLeft}</strong> del mes +{" "}
              <strong className="text-foreground">{bonusCreditsRemaining}</strong> créditos extra.{" "}
              <strong className="text-foreground">Total disponible: {totalCreditsAvailable} créditos.</strong> Un boost
              gasta 1; un scan URL gasta {CREDIT_COST_URL_AUDIT}.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="sm" className="gap-1.5 shadow-md">
                <Link href="/dashboard/product">
                  <PackageSearch className="h-4 w-4" />
                  Boost ficha
                  <ArrowRight className="h-3.5 w-3.5 opacity-70" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="secondary" className="gap-1.5">
                <Link href="/dashboard/audit">
                  <LineChart className="h-4 w-4" />
                  Scan URL
                </Link>
              </Button>
              {!isPaid ? (
                <>
                  {commerceEnabled ? (
                    <Button asChild size="sm" variant="outline" className="gap-1 border-primary/30">
                      <Link href="/pricing">
                        <Sparkles className="h-4 w-4" />
                        Mejorar plan
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="gap-1 border-dashed text-muted-foreground">
                      <Sparkles className="h-4 w-4 opacity-50" />
                      Planes próximamente
                    </Button>
                  )}
                  {commerceEnabled ? (
                    <Button
                      asChild
                      size="sm"
                      className="gap-1 border border-primary/25 bg-gradient-to-r from-primary/15 to-violet-500/10 font-semibold shadow-md"
                    >
                      <Link href="/pricing/credits">
                        <Coins className="h-4 w-4" />
                        Comprar créditos
                      </Link>
                    </Button>
                  ) : null}
                </>
              ) : commerceEnabled ? (
                <Button asChild size="sm" variant="outline" className="gap-1 border-amber-500/30">
                  <Link href="/pricing/credits">
                    <Coins className="h-4 w-4" />
                    Más créditos
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="w-full space-y-5 rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-md lg:max-w-[280px]">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Cupo mensual (créditos)
              </span>
              <span className="tabular-nums text-foreground">
                {used} / {limit}
              </span>
            </div>
            <Progress value={pctUsed} className="mt-2 h-2.5 bg-secondary/80" />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {pctUsed}% consumido · se renueva cada mes
            </p>
          </div>
          <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/12 to-violet-500/10 px-4 py-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Coins className="h-4 w-4 text-primary" />
              Créditos extra
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">{bonusCreditsRemaining}</p>
            {commerceEnabled ? (
              <Button asChild size="sm" className="mt-3 w-full font-semibold shadow-sm">
                <Link href="/pricing/credits">+ Comprar créditos</Link>
              </Button>
            ) : (
              <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
                Compra de créditos cuando activemos pagos.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
