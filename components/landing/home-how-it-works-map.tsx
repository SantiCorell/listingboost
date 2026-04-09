"use client";

import { useCallback, useId, useState } from "react";
import { ChevronRight, Globe2, Lightbulb, MousePointerClick, Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type HomeHowItWorksMapProps = {
  /** Versión baja para situar bajo el mock en el hero. */
  compact?: boolean;
};

const STEPS = [
  {
    key: "pick",
    label: "Tú eliges",
    Icon: MousePointerClick,
    lead: "Tú eliges qué mirar.",
    body: "Nos dices una búsqueda, la página de tu web o un producto que vas a vender.",
  },
  {
    key: "google",
    label: "Google",
    Icon: Globe2,
    lead: "Preguntamos a Google.",
    body: "Miramos qué resultados enseña para esa búsqueda, en tu idioma y país, para ver qué temas salen arriba.",
  },
  {
    key: "rivals",
    label: "Competencia",
    Icon: Users,
    lead: "Miramos a la competencia.",
    body: "Comparamos páginas que aparecen cuando alguien busca lo mismo que tú. Solo usamos lo público que vería cualquier persona.",
  },
  {
    key: "report",
    label: "Prioridades",
    Icon: Lightbulb,
    lead: "Te lo ordenamos.",
    body: "Prioridades claras y textos listos para publicar: mejor para humanos y para que buscadores y sistemas de IA capten bien tu oferta cuando alguien pregunta.",
  },
  {
    key: "ship",
    label: "Publicar",
    Icon: Send,
    lead: "Tú publicas.",
    body: "Nosotros no publicamos por ti: te damos borradores y mejoras para que las pegues donde toque.",
  },
] as const;

export function HomeHowItWorksMap({ compact = false }: HomeHowItWorksMapProps) {
  const [active, setActive] = useState(0);
  const headingId = useId();
  const panelId = useId();

  const go = useCallback((i: number) => {
    setActive(((i % STEPS.length) + STEPS.length) % STEPS.length);
  }, []);

  return (
    <section
      className={cn(
        "max-w-full min-w-0 overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-b from-card/95 to-muted/20 shadow-sm backdrop-blur-sm",
        compact ? "mx-0 w-full p-2.5 ring-1 ring-border/40 sm:p-3" : "mx-auto max-w-xl p-4 sm:p-5",
      )}
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className={cn(
          "font-semibold tracking-tight text-foreground",
          compact ? "font-mono text-[10px] uppercase tracking-[0.18em] text-primary/90" : "text-sm",
        )}
      >
        Pipeline
        {!compact ? (
          <span className="font-sans font-normal text-muted-foreground"> · toca un paso</span>
        ) : null}
      </h2>

      <div
        className={cn(
          "min-w-0 max-w-full",
          compact
            ? "mt-2 grid grid-cols-2 gap-1.5 sm:mt-2.5 sm:flex sm:flex-wrap sm:gap-2"
            : "mt-4 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1",
        )}
      >
        {STEPS.map((step, i) => {
          const isOn = i === active;
          const Icon = step.Icon;
          return (
            <div
              key={step.key}
              className={cn(
                compact
                  ? cn("min-w-0 max-w-full", i === STEPS.length - 1 && "col-span-2")
                  : "flex items-center gap-1 sm:contents",
              )}
            >
              <button
                type="button"
                onClick={() => go(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    go(i + 1);
                  }
                  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    go(i - 1);
                  }
                }}
                aria-pressed={isOn}
                aria-controls={panelId}
                className={cn(
                  "inline-flex min-w-0 items-center gap-1.5 rounded-lg border text-left font-semibold transition-all",
                  compact
                    ? "h-auto min-h-[2.5rem] w-full px-2 py-1.5 text-[10px] leading-tight sm:min-h-[2.25rem] sm:w-auto sm:shrink-0 sm:px-2.5 sm:text-[11px]"
                    : "w-full gap-2 rounded-xl px-3 py-2.5 text-xs sm:w-auto sm:shrink-0 sm:py-2",
                  isOn
                    ? "border-primary/45 bg-primary/12 text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]"
                    : "border-border/60 bg-background/50 text-muted-foreground hover:border-primary/30 hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-md",
                    compact ? "h-6 w-6" : "h-8 w-8 rounded-lg",
                    isOn ? "bg-primary/20 text-primary" : "bg-muted/60 text-muted-foreground",
                  )}
                >
                  <Icon className={compact ? "h-3 w-3" : "h-4 w-4"} aria-hidden />
                </span>
                <span className="min-w-0 flex-1 text-balance leading-tight">{step.label}</span>
              </button>
              {!compact && i < STEPS.length - 1 ? (
                <ChevronRight
                  className="mx-auto hidden h-4 w-4 shrink-0 text-muted-foreground/50 sm:mx-0 sm:block lg:mx-0.5"
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        id={panelId}
        role="region"
        aria-live="polite"
        className={cn(
          "mt-2.5 max-w-full min-w-0 rounded-lg border border-dashed border-primary/25 bg-primary/[0.05] text-muted-foreground sm:mt-3",
          compact ? "px-2 py-2 text-[10px] leading-snug sm:px-2.5 sm:text-[11px] md:text-xs" : "px-3 py-3 text-sm sm:px-4 sm:py-3.5",
        )}
      >
        <p className="break-words text-foreground">
          <span className="font-medium text-foreground/95">{STEPS[active].lead}</span> {STEPS[active].body}
        </p>
      </div>
    </section>
  );
}
