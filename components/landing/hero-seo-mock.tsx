import { BarChart3, Bot, Gauge, Search, Sparkles, TrendingUp } from "lucide-react";

/**
 * Mock visual hero: Google / SERP + tracking + señal para IA — optimizado móvil (sin overflow horizontal).
 */
export function HeroSeoMock() {
  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden select-none" aria-hidden>
      <div className="pointer-events-none absolute -right-4 top-2 h-24 w-24 rounded-full bg-violet-500/15 blur-2xl sm:-right-6 sm:h-36 sm:w-36 sm:blur-3xl" />
      <div className="pointer-events-none absolute -left-3 bottom-4 h-20 w-20 rounded-full bg-primary/15 blur-2xl sm:-left-4 sm:bottom-6 sm:h-32 sm:w-32 sm:blur-3xl" />

      <div className="glass-panel relative max-w-full min-w-0 overflow-hidden p-2 shadow-xl sm:p-3 sm:shadow-2xl md:p-4">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.07)_0%,transparent_40%,hsl(var(--accent)/0.09)_100%)]" />

        {/* Barra tipo navegador + búsqueda */}
        <div className="relative min-w-0 space-y-1.5 sm:space-y-2">
          <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-border/50 bg-white/75 px-2 py-1.5 dark:bg-black/45 sm:gap-2 sm:rounded-xl sm:px-2.5 sm:py-2">
            <div className="flex shrink-0 gap-1 pl-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400/90 sm:h-2 sm:w-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400/90 sm:h-2 sm:w-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90 sm:h-2 sm:w-2" />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-border/40 bg-muted/30 px-2 py-1 sm:gap-2 sm:rounded-lg sm:px-2.5 sm:py-1.5">
              <GlobeMini />
              <span className="min-w-0 truncate font-mono text-[9px] text-muted-foreground sm:text-[10px]">
                google.com/search
              </span>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-1.5 rounded-lg border border-primary/15 bg-gradient-to-r from-primary/[0.06] to-transparent px-2 py-1.5 sm:flex-row sm:items-center sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2">
            <div className="flex min-w-0 items-start gap-1.5 sm:items-center">
              <Search className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary sm:mt-0 sm:h-4 sm:w-4" strokeWidth={2.25} />
              <p className="min-w-0 break-words text-[11px] font-medium leading-snug text-foreground sm:truncate sm:text-xs">
                comprar auriculares cancelación ruido envío 24h
              </p>
            </div>
            <span className="shrink-0 self-start rounded-md bg-primary/15 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-wide text-primary sm:self-center sm:px-2 sm:text-[9px] sm:ml-auto">
              intención transaccional
            </span>
          </div>
        </div>

        <div className="relative mt-2 grid min-w-0 max-w-full gap-2 sm:mt-3 sm:gap-3 sm:grid-cols-[1.12fr_0.88fr] sm:gap-3.5">
          {/* Bloque SERP */}
          <div className="min-w-0 max-w-full rounded-xl border border-border/60 bg-white/82 p-2.5 shadow-inner dark:bg-black/38 sm:rounded-2xl sm:p-3.5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 sm:mb-2.5 sm:gap-2">
              <span className="inline-flex min-w-0 items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-primary sm:gap-1.5 sm:text-[10px]">
                <Sparkles className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                <span className="truncate">Vista resultados</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-emerald-800 dark:text-emerald-200 sm:gap-1 sm:px-2 sm:py-0.5 sm:text-[10px]">
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Pos. 8 → 3
              </span>
            </div>
            <div className="max-w-full rounded-lg border border-border/50 bg-background/80 px-2 py-2 sm:rounded-xl sm:px-3 sm:py-2.5">
              <p className="break-words text-[12px] font-semibold leading-snug text-blue-600 dark:text-blue-400 sm:text-[13px]">
                Auriculares ANC Pro · Garantía 2 años | Tu marca
              </p>
              <p className="mt-0.5 break-all text-[10px] leading-snug text-emerald-700 dark:text-emerald-400 sm:break-normal sm:truncate sm:text-[11px]">
                https://tumarca.com/audio/auriculares-anc-pro
              </p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
                Híbrido ANC, 40h de batería, multipunto. Contenido útil para compradores y para resúmenes automáticos.
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-1 sm:mt-2.5 sm:gap-1.5">
              {["Product", "FAQPage", "BreadcrumbList"].map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[8px] font-medium text-muted-foreground sm:rounded-md sm:px-2 sm:text-[9px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bloque métricas + IA */}
          <div className="flex min-w-0 max-w-full flex-col gap-2 rounded-xl border border-violet-500/25 bg-gradient-to-b from-violet-500/[0.08] via-transparent to-primary/[0.04] p-2.5 sm:gap-2.5 sm:rounded-2xl sm:p-3.5">
            <div className="flex min-w-0 items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1 text-[11px] font-semibold text-foreground sm:gap-1.5 sm:text-xs">
                <BarChart3 className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400 sm:h-4 sm:w-4" />
                <span className="truncate">Huecos vs rivales</span>
              </span>
              <Gauge className="h-3.5 w-3.5 shrink-0 text-primary/80 sm:h-4 sm:w-4" />
            </div>
            <ul className="min-w-0 space-y-1.5 sm:space-y-2">
              {[
                { label: "Intención de compra", short: "Intención compra", pct: 92 },
                { label: "Respuesta directa (AEO)", short: "AEO / respuestas", pct: 78 },
                { label: "Título ↔ H1 ↔ texto", short: "Coherencia on-page", pct: 88 },
              ].map((row) => (
                <li key={row.label} className="min-w-0">
                  <div className="mb-0.5 flex items-center justify-between gap-2 text-[9px] font-medium text-muted-foreground sm:text-[10px]">
                    <span className="min-w-0 sm:truncate">
                      <span className="sm:hidden">{row.short}</span>
                      <span className="hidden sm:inline">{row.label}</span>
                    </span>
                    <span className="shrink-0 tabular-nums text-foreground">{row.pct}%</span>
                  </div>
                  <div className="h-1.5 max-w-full overflow-hidden rounded-full bg-muted/70">
                    <div
                      className="h-full max-w-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex min-w-0 gap-1.5 rounded-lg border border-dashed border-violet-400/35 bg-card/70 p-2 dark:bg-black/30 sm:rounded-xl sm:gap-2 sm:p-2.5">
              <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400 sm:h-4 sm:w-4" />
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-200 sm:text-[10px]">
                  Señal para IA
                </p>
                <p className="mt-0.5 text-[9px] leading-relaxed text-muted-foreground sm:text-[10px]">
                  FAQs claras y datos visibles: menos contradicciones cuando un modelo resume tu oferta.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative mt-2 px-0.5 text-center text-[8px] font-mono uppercase leading-tight tracking-wide text-muted-foreground sm:mt-3 sm:text-[10px] sm:tracking-[0.14em]">
          <span className="hidden sm:inline">Google · SERP · gaps · contenido interpretable por IA</span>
          <span className="sm:hidden">Google · SERP · gaps · IA</span>
        </p>
      </div>
    </div>
  );
}

function GlobeMini() {
  return (
    <svg className="h-3 w-3 shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
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
