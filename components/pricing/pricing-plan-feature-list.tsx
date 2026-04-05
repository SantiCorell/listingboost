"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PricingPlanFeatureListProps = {
  items: string[];
  /** Si true, el acordeón empieza abierto (p. ej. destacar un plan). */
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
  const [expanded, setExpanded] = useState(defaultOpen);
  const count = items.length;
  const hint = summaryHint ?? `${count} ventajas incluidas`;

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
    <div className={cn("min-h-0 w-full", className)}>
      <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/25">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-foreground outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="min-w-0">
            {expanded ? "Ocultar lo incluido" : "Ver lo incluido"}
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
        {expanded ? (
          <div className="border-t border-border/60">
            <div className="max-h-[min(42vh,260px)] overflow-y-auto overscroll-contain px-3 pb-3 pt-2 sm:max-h-[240px] lg:max-h-[220px]">
              {list("")}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
