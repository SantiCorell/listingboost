"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SeoGapHeroStats,
  SeoGapIntentChart,
  SeoGapLevelChart,
  SeoGapDemandChart,
  DEMAND_LABEL,
} from "@/components/seo/seo-gap-charts";
import { SeoGapClusterPanel } from "@/components/seo/seo-gap-cluster-panel";
import { SeoGapCockpitInteractive } from "@/components/seo/seo-gap-cockpit-interactive";
import { formatMonthlyVolumeEs } from "@/lib/seo/format-search-volume";
import type { SeoGapFinderResult, SeoGapOpportunity } from "@/types/seo-gap-finder";
import { isLongTailGem } from "@/types/seo-gap-finder";
import { ArrowRight, Gem, LayoutGrid } from "lucide-react";

const LEVEL_BADGE: Record<string, string> = {
  alta: "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
  media: "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100",
  baja: "border-border bg-muted/50 text-muted-foreground",
};

const DEMAND_BADGE: Record<string, string> = {
  alto: "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-100",
  medio: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  bajo: "border-teal-500/30 bg-teal-500/10 text-teal-900 dark:text-teal-100",
  nicho: "border-emerald-500/40 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100",
};

function OpportunityCard({ o }: { o: SeoGapOpportunity }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/10 p-4 shadow-sm transition-colors hover:border-primary/25">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{o.keyword}</p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span>{o.cluster}</span>
            <span>·</span>
            <span className="capitalize">{o.type}</span>
            <span>·</span>
            <span className="tabular-nums">score {o.score}</span>
            <span>·</span>
                <span className="tabular-nums" title="Estimación orientativa de búsquedas mensuales en Google">
                  ~{formatMonthlyVolumeEs(o.monthlyVolumeEstimate)}/mes
                </span>
            {o.trendsInterest != null ? (
              <>
                <span>·</span>
                <span className="tabular-nums" title="Interés relativo en Google Trends (últimos meses)">
                  Interés {o.trendsInterest}
                </span>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          <Badge variant="outline" className={DEMAND_BADGE[o.demandTier] ?? ""} title="Estimación de volumen / especificidad">
            {DEMAND_LABEL[o.demandTier]}
          </Badge>
          <Badge className={LEVEL_BADGE[o.opportunityLevel] ?? ""}>{o.opportunityLevel}</Badge>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{o.action}</p>
      <p className="mt-2 text-sm">
        <span className="text-muted-foreground">Título sugerido:</span>{" "}
        <strong className="text-foreground">{o.title}</strong>
      </p>
      <p className="mt-1 font-mono text-xs text-primary">{o.url}</p>
      <Button asChild size="sm" className="mt-3 gap-1">
        <Link href={`/dashboard/seo-engine?tab=content&kw=${encodeURIComponent(o.keyword)}`}>
          Generar página
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}

export function SeoGapReportBody({
  data,
  toolbar,
}: {
  data: SeoGapFinderResult;
  toolbar?: ReactNode;
}) {
  const { opportunities, executiveSummary, meta } = data;
  const gems = opportunities.filter(isLongTailGem).sort((a, b) => b.score - a.score);
  const headAndMid = opportunities.filter((o) => !isLongTailGem(o)).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8">
      {toolbar ? <div className="flex flex-wrap items-center justify-between gap-2">{toolbar}</div> : null}

      <Card className="overflow-hidden border-violet-200/50 bg-violet-500/[0.04] dark:border-violet-500/20 dark:bg-violet-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resumen ejecutivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{executiveSummary}</p>
        </CardContent>
      </Card>

      <section
        className="relative overflow-hidden rounded-3xl border border-violet-500/35 bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#1a0f2e] p-5 shadow-2xl ring-1 ring-white/10 md:p-8"
        aria-label="Visualización de oportunidades SEO"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300/90">Cockpit SEO</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">Mapa de oportunidades</h2>
              <p className="mt-1 max-w-xl text-sm text-slate-400">
                Head, long-tail y nicho en un solo vistazo. Más peso a lo que puedes ejecutar ya.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
              <LayoutGrid className="h-3.5 w-3.5 text-violet-300" aria-hidden />
              {meta.competitorsCrawled} URLs SERP · {meta.organicCount} orgánicos
            </div>
          </div>

          <SeoGapHeroStats opportunities={opportunities} />

          <div className="grid gap-4 lg:grid-cols-3">
            <SeoGapIntentChart opportunities={opportunities} />
            <SeoGapLevelChart opportunities={opportunities} />
            <SeoGapDemandChart opportunities={opportunities} />
          </div>

          <SeoGapCockpitInteractive
            opportunities={opportunities}
            trendsDataPoints={meta.trendsDataPoints}
          />

          <SeoGapClusterPanel opportunities={opportunities} />
        </div>
      </section>

      {gems.length > 0 ? (
        <Card className="overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.06] to-transparent shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gem className="h-5 w-5 text-emerald-600" aria-hidden />
              Gems long-tail & nicho
            </CardTitle>
            <CardDescription>
              Consultas más específicas o con volumen estimado bajo: suelen convertir mejor y tener menos competencia
              en la SERP. Ideal para blogs, FAQs y landings hiper-contextualizadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {gems.map((o, i) => (
              <OpportunityCard key={`gem-${o.keyword}-${i}`} o={o} />
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Head & demanda media</CardTitle>
          <CardDescription>
            Términos con demanda estimada más alta o media. Complementan las gems long-tail de arriba.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {headAndMid.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              En este informe casi todo es long-tail o nicho: revisa la sección <strong className="text-foreground">Gems</strong>.
            </p>
          ) : (
            headAndMid.map((o, i) => <OpportunityCard key={`head-${o.keyword}-${i}`} o={o} />)
          )}
        </CardContent>
      </Card>

      {meta.crawlWarnings.length ? (
        <Card className="border-amber-500/30 bg-amber-500/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-900 dark:text-amber-100">Avisos de rastreo</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {meta.crawlWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
