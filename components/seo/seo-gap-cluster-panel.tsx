"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatMonthlyVolumeEs } from "@/lib/seo/format-search-volume";
import type { SeoGapOpportunity } from "@/types/seo-gap-finder";
import { ChevronDown, Layers, Sparkles } from "lucide-react";

type ClusterAgg = {
  name: string;
  items: SeoGapOpportunity[];
  count: number;
  avgScore: number;
};

export function SeoGapClusterPanel({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const clusters = useMemo(() => {
    const map = new Map<string, SeoGapOpportunity[]>();
    for (const o of opportunities) {
      const k = o.cluster.trim() || "General";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(o);
    }
    return [...map.entries()]
      .map(([name, items]) => ({
        name,
        items: [...items].sort((a, b) => b.score - a.score),
        count: items.length,
        avgScore: Math.round(items.reduce((s, x) => s + x.score, 0) / items.length),
      }))
      .sort((a, b) => b.count - a.count);
  }, [opportunities]);

  const maxCount = Math.max(1, ...clusters.map((c) => c.count));

  if (clusters.length === 0) return null;

  return (
    <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/50 via-[#0c1222] to-fuchsia-950/35 p-5 shadow-2xl ring-1 ring-violet-500/15 md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-600/20 text-violet-200 ring-1 ring-white/10">
            <Layers className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200/90">Clusters de contenido</p>
            <p className="mt-1 max-w-xl text-[13px] leading-snug text-slate-400">
              Temas donde agrupan tus oportunidades. Despliega cada bloque para ver las keywords y saltar a generar
              contenido.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
          <Sparkles className="h-3 w-3 text-amber-300" aria-hidden />
          Interactivo
        </span>
      </div>

      <ul className="space-y-2">
        {clusters.map((c, i) => (
          <ClusterRow key={c.name} cluster={c} maxCount={maxCount} defaultOpen={i === 0} />
        ))}
      </ul>
    </div>
  );
}

function ClusterRow({
  cluster,
  maxCount,
  defaultOpen,
}: {
  cluster: ClusterAgg;
  maxCount: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const pct = Math.round((cluster.count / maxCount) * 100);

  return (
    <li className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20 shadow-inner transition-colors hover:border-violet-500/25 hover:bg-black/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3 py-3 text-left md:gap-4 md:px-4"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-violet-300/80 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-slate-100" title={cluster.name}>
            {cluster.name}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Score medio <span className="tabular-nums text-slate-400">{cluster.avgScore}</span> · {cluster.count}{" "}
            {cluster.count === 1 ? "keyword" : "keywords"}
          </p>
        </div>
        <div className="hidden w-28 shrink-0 sm:block">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.45)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-violet-500/20 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-violet-100">
          {cluster.count}
        </span>
      </button>

      {open ? (
        <div className="border-t border-white/[0.06] bg-black/25 px-3 py-3 md:px-4">
          <ul className="space-y-2">
            {cluster.items.map((o, i) => (
              <li
                key={`${o.keyword}-${i}`}
                className="flex flex-col gap-2 rounded-lg border border-white/[0.05] bg-white/[0.03] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-slate-200">{o.keyword}</p>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="tabular-nums text-[11px] text-slate-500">
                    {formatMonthlyVolumeEs(o.monthlyVolumeEstimate)}/mes · {o.score} pts
                  </span>
                  <Link
                    href={`/dashboard/seo-engine?tab=content&kw=${encodeURIComponent(o.keyword)}`}
                    className="inline-flex shrink-0 items-center rounded-md border border-violet-500/35 bg-violet-600/25 px-2.5 py-1 text-[11px] font-semibold text-violet-100 transition-colors hover:bg-violet-600/40"
                  >
                    Generar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}
