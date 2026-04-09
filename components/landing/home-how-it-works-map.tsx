"use client";

import { useCallback, useId, useState } from "react";
import { ChevronRight, Globe2, Lightbulb, MousePointerClick, Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
    body: "Te damos una lista clara de qué tocar primero y, cuando toca, textos sugeridos. Tú revisas y decides.",
  },
  {
    key: "ship",
    label: "Publicar",
    Icon: Send,
    lead: "Tú publicas.",
    body: "Nosotros no publicamos por ti: te damos borradores y mejoras para que las pegues donde toque.",
  },
] as const;

export function HomeHowItWorksMap() {
  const [active, setActive] = useState(0);
  const headingId = useId();
  const panelId = useId();

  const go = useCallback((i: number) => {
    setActive(((i % STEPS.length) + STEPS.length) % STEPS.length);
  }, []);

  return (
    <section
      className="max-w-xl rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="text-sm font-semibold text-foreground">
        Cómo trabajamos <span className="font-normal text-muted-foreground">(toca cada paso)</span>
      </h2>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1">
        {STEPS.map((step, i) => {
          const isOn = i === active;
          const Icon = step.Icon;
          return (
            <div key={step.key} className="flex items-center gap-1 sm:contents">
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
                  "inline-flex w-full min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors sm:w-auto sm:shrink-0 sm:py-2",
                  isOn
                    ? "border-primary/50 bg-primary/10 text-foreground shadow-sm"
                    : "border-border/80 bg-muted/30 text-muted-foreground hover:border-primary/25 hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    isOn ? "bg-primary/20 text-primary" : "bg-background/80 text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 leading-tight">{step.label}</span>
              </button>
              {i < STEPS.length - 1 ? (
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
        className="mt-4 rounded-xl border border-dashed border-primary/20 bg-primary/[0.04] px-3 py-3 text-sm leading-relaxed text-muted-foreground sm:px-4 sm:py-3.5"
      >
        <p className="text-foreground">
          <span className="font-medium">{STEPS[active].lead}</span> {STEPS[active].body}
        </p>
      </div>
    </section>
  );
}
