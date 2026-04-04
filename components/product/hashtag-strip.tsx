"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Hash } from "lucide-react";

type Props = {
  hashtags: string[];
};

export function HashtagStrip({ hashtags }: Props) {
  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  const normalized = hashtags.filter(Boolean);
  if (!normalized.length) return null;

  const asLine = normalized.join(" ");
  const asLines = normalized.join("\n");

  return (
    <div className="space-y-3 rounded-xl border border-accent/35 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent">
            <Hash className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Hashtags redes</p>
            <p className="text-xs text-muted-foreground">
              Listos para pegar en Instagram, TikTok o Shorts — un clic para copiar bloque.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" className="h-8" onClick={() => copy(asLine)}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copiar línea
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => copy(asLines)}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Uno por línea
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {normalized.map((h) => (
          <Button
            key={h}
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-full border-primary/20 bg-background/80 px-3 font-mono text-xs font-medium hover:bg-primary/10"
            onClick={() => copy(h)}
          >
            {h}
          </Button>
        ))}
      </div>
    </div>
  );
}
