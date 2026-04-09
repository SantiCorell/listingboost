import { BarChart3, Bot, Gauge, Search, Sparkles, TrendingUp } from "lucide-react";

/**
 * Mock visual hero: Google / SERP + tracking + señal para IA — sin assets externos.
 */
export function HeroSeoMock() {
  return (
    <div className="relative w-full select-none" aria-hidden>
      <div className="pointer-events-none absolute -right-6 top-4 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-4 bottom-6 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />

      <div className="glass-panel relative overflow-hidden p-3 shadow-2xl sm:p-4">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.07)_0%,transparent_40%,hsl(var(--accent)/0.09)_100%)]" />

        {/* Barra tipo navegador + búsqueda */}
        <div className="relative space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-white/75 px-2.5 py-2 dark:bg-black/45">
            <div className="flex gap-1 pl-0.5">
              <span className="h-2 w-2 rounded-full bg-red-400/90" />
              <span className="h-2 w-2 rounded-full bg-amber-400/90" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/90" />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5">
              <GlobeMini />
              <span className="truncate font-mono text-[10px] text-muted-foreground">google.com/search</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] to-transparent px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
            <p className="min-w-0 truncate text-xs font-medium text-foreground">
              comprar auriculares cancelación ruido envío 24h
            </p>
            <span className="ml-auto hidden shrink-0 rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-primary sm:inline">
              intención transaccional
            </span>
          </div>
        </div>

        <div className="relative mt-3 grid gap-3 sm:grid-cols-[1.12fr_0.88fr] sm:gap-3.5">
          {/* Bloque SERP */}
          <div className="rounded-2xl border border-border/60 bg-white/82 p-3.5 shadow-inner dark:bg-black/38">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Vista resultados
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-emerald-800 dark:text-emerald-200">
                <TrendingUp className="h-3 w-3" />
                Pos. 8 → 3
              </span>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/80 px-3 py-2.5">
              <p className="text-[13px] font-semibold leading-snug text-blue-600 dark:text-blue-400">
                Auriculares ANC Pro · Garantía 2 años | Tu marca
              </p>
              <p className="mt-0.5 truncate text-[11px] text-emerald-700 dark:text-emerald-400">
                https://tumarca.com/audio/auriculares-anc-pro
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                Híbrido ANC, 40h de batería, multipunto. Guía de tallas y comparativa con rivales — contenido
                actualizado para compradores y para resúmenes automáticos.
              </p>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {["Product", "FAQPage", "BreadcrumbList"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[9px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bloque métricas + IA */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-violet-500/25 bg-gradient-to-b from-violet-500/[0.08] via-transparent to-primary/[0.04] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Huecos vs rivales
              </span>
              <Gauge className="h-4 w-4 shrink-0 text-primary/80" />
            </div>
            <ul className="space-y-2">
              {[
                { label: "Keywords con intención de compra", pct: 92 },
                { label: "Páginas con respuesta directa (AEO)", pct: 78 },
                { label: "Coherencia título ↔ H1 ↔ contenido", pct: 88 },
              ].map((row) => (
                <li key={row.label}>
                  <div className="mb-0.5 flex items-center justify-between gap-2 text-[10px] font-medium text-muted-foreground">
                    <span className="min-w-0 truncate">{row.label}</span>
                    <span className="shrink-0 tabular-nums text-foreground">{row.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex gap-2 rounded-xl border border-dashed border-violet-400/35 bg-card/70 p-2.5 dark:bg-black/30">
              <Bot className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-200">
                  Señal para sistemas de IA
                </p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                  Entidades claras, FAQs honestas y datos alineados con lo visible: menos contradicciones cuando un
                  modelo resume tu oferta.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Google · SERP · gaps · contenido interpretable por IA
        </p>
      </div>
    </div>
  );
}

function GlobeMini() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
