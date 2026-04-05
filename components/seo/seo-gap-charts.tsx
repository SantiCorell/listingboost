"use client";

import type { SeoGapOpportunity } from "@/types/seo-gap-finder";

function aggregate(
  opportunities: SeoGapOpportunity[],
): {
  intent: Record<string, number>;
  level: Record<string, number>;
} {
  const intent: Record<string, number> = {
    informacional: 0,
    transaccional: 0,
    navegacional: 0,
  };
  const level: Record<string, number> = { alta: 0, media: 0, baja: 0 };
  for (const o of opportunities) {
    intent[o.type] = (intent[o.type] ?? 0) + 1;
    level[o.opportunityLevel] = (level[o.opportunityLevel] ?? 0) + 1;
  }
  return { intent, level };
}

const INTENT_LABEL: Record<string, string> = {
  informacional: "Informacional",
  transaccional: "Transaccional",
  navegacional: "Navegacional",
};

const LEVEL_COLOR: Record<string, string> = {
  alta: "hsl(var(--primary))",
  media: "hsl(38 92% 50%)",
  baja: "hsl(var(--muted-foreground) / 0.45)",
};

export function SeoGapIntentChart({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const { intent } = aggregate(opportunities);
  const entries = Object.entries(intent).filter(([, n]) => n > 0);
  const max = Math.max(1, ...entries.map(([, n]) => n));
  const w = 280;
  const h = 120;
  const barH = 22;
  const gap = 10;

  return (
    <div className="rounded-xl border border-border/70 bg-gradient-to-br from-violet-500/[0.06] to-card p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Intención de búsqueda (oportunidades)
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm" role="img" aria-label="Distribución por intención">
        <title>Distribución de keywords por intención</title>
        {entries.map(([key, n], i) => {
          const y = i * (barH + gap) + 8;
          const bw = Math.round((n / max) * (w - 120));
          return (
            <g key={key}>
              <text x={0} y={y + 15} className="fill-foreground text-[11px] font-medium">
                {INTENT_LABEL[key] ?? key}
              </text>
              <rect
                x={118}
                y={y + 2}
                width={bw}
                height={barH - 4}
                rx={4}
                className="fill-primary/85"
              />
              <text x={118 + bw + 6} y={y + 15} className="fill-muted-foreground text-[10px]">
                {n}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SeoGapLevelChart({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const { level } = aggregate(opportunities);
  const order: (keyof typeof level)[] = ["alta", "media", "baja"];
  const total = opportunities.length || 1;
  const size = 112;
  const cx = size / 2;
  const cy = size / 2;
  const r = 36;
  let angle = -Math.PI / 2;

  const slices = order.map((k) => {
    const n = level[k] ?? 0;
    const frac = n / total;
    const a0 = angle;
    angle += frac * Math.PI * 2;
    return { k, n, a0, a1: angle, frac };
  });

  function arcPath(a0: number, a1: number) {
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
  }

  return (
    <div className="rounded-xl border border-border/70 bg-gradient-to-br from-sky-500/[0.06] to-card p-4 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Prioridad (alta / media / baja)
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-28 w-28 shrink-0" role="img" aria-label="Donut prioridad">
          <title>Oportunidades por nivel</title>
          {slices.map(
            (s) =>
              s.frac > 0 && (
                <path
                  key={s.k}
                  d={arcPath(s.a0, s.a1)}
                  fill={LEVEL_COLOR[s.k] ?? "#888"}
                  opacity={0.92}
                />
              ),
          )}
          <circle cx={cx} cy={cy} r={18} className="fill-background" />
          <text x={cx} y={cy + 4} textAnchor="middle" className="fill-foreground text-[10px] font-bold">
            {total}
          </text>
        </svg>
        <ul className="min-w-0 flex-1 space-y-1.5 text-xs">
          {order.map((k) => (
            <li key={k} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: LEVEL_COLOR[k] }} />
              <span className="capitalize text-foreground">{k}</span>
              <span className="text-muted-foreground">({level[k] ?? 0})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SeoGapScoreBars({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const top = [...opportunities].sort((a, b) => b.score - a.score).slice(0, 8);
  const max = Math.max(1, ...top.map((o) => o.score));
  const w = 360;
  const rowH = 26;

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Top oportunidades por score
      </p>
      <svg
        viewBox={`0 0 ${w} ${top.length * rowH + 8}`}
        className="w-full"
        role="img"
        aria-label="Barras de score"
      >
        <title>Keywords con mayor score</title>
        {top.map((o, i) => {
          const y = i * rowH + 6;
          const bw = Math.round((o.score / max) * (w - 150));
          return (
            <g key={o.keyword + i}>
              <text x={0} y={y + 14} className="fill-foreground text-[10px] font-medium">
                {o.keyword.length > 28 ? `${o.keyword.slice(0, 26)}…` : o.keyword}
              </text>
              <rect x={132} y={y + 2} width={bw} height={14} rx={3} className="fill-primary/75" />
              <text x={132 + bw + 4} y={y + 13} className="fill-muted-foreground text-[9px]">
                {o.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
