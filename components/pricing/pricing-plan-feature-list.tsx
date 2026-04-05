"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PricingPlanFeatureListProps = {
  items: string[];
  /** En desktop (lg+), abrir la lista al montar. En móvil siempre empieza cerrada para acortar la card. */
  defaultOpen?: boolean;
  summaryHint?: string;
  className?: string;
};

export function PricingPlanFeatureList({
  items,
  defaultOpen = false,
  summaryHint,
  className,
}: PricingPlanFeatureListProps) {
  const [expanded, setExpanded] = useState(false);
  const count = items.length;
  const hint = summaryHint ?? `${count} ventajas incluidas`;

  useEffect(() => {
    if (!defaultOpen || typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (mq.matches) setExpanded(true);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [defaultOpen]);

  const list = (extraClass: string) => (
    <ul
      className={cn(
        "space-y-2.5 text-pretty text-sm leading-relaxed text-muted-foreground break-words",
        extraClass,
      )}
    >
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("min-h-0 flex-1", className)}>
      <div className="hidden lg:block">{list("")}</div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/25 lg:hidden">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-foreground outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="min-w-0">
            {expanded ? "Ocultar detalle" : "Ver todo lo incluido"}
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{hint}</span>
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        {expanded ? <div className="border-t border-border/60 px-3 pb-3 pt-1">{list("pt-2")}</div> : null}
      </div>
    </div>
  );
}
