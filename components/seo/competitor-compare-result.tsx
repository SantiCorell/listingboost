"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { CompetitorCompareOutput } from "@/types/competitor-compare";
import { chargeCompetitorPdfExport } from "@/actions/competitor-pdf";
import { downloadCompetitorComparePdfClient } from "@/components/seo/competitor-pdf-export";
import {
  ArrowRight,
  FileDown,
  GitCompare,
  KeyRound,
  LayoutList,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";

export function CompetitorCompareResult({
  data,
  urlA,
  urlB,
  pdfExportFree,
}: {
  data: CompetitorCompareOutput;
  urlA: string;
  urlB: string;
  /** Pro+ / Enterprise / admin: sin coste PDF */
  pdfExportFree: boolean;
}) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfErr, setPdfErr] = useState<string | null>(null);

  async function handlePdf() {
    setPdfErr(null);
    setPdfLoading(true);
    try {
      const r = await chargeCompetitorPdfExport();
      if (!r.ok) {
        setPdfErr(r.error);
        return;
      }
      await downloadCompetitorComparePdfClient(data, urlA, urlB);
    } catch {
      setPdfErr("No se pudo generar el PDF.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitCompare className="h-4 w-4 text-primary" />
          <span>Resultado de la comparativa</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="default"
            className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 shadow-md hover:from-violet-500 hover:to-purple-500"
            disabled={pdfLoading}
            onClick={() => void handlePdf()}
          >
            {pdfLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            Exportar PDF
          </Button>
          <Badge variant="secondary" className="font-normal">
            {pdfExportFree ? "Incluido en tu plan" : "1 crédito"}
          </Badge>
        </div>
      </div>
      {pdfErr ? <p className="text-sm text-destructive">{pdfErr}</p> : null}

      {/* URLs */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 to-background p-4 dark:border-violet-500/25 dark:from-violet-950/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Tu URL (A)</p>
          <p className="mt-1 break-all font-mono text-sm text-foreground">{urlA}</p>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 to-background p-4 dark:border-slate-600/40 dark:from-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Competidor (B)</p>
          <p className="mt-1 break-all font-mono text-sm text-foreground">{urlB}</p>
        </div>
      </div>

      {/* Hero resumen */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-background to-violet-500/[0.06] p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Resumen ejecutivo</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
        <div className="flex items-start gap-3">
          <LayoutList className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <h4 className="font-semibold text-foreground">Contenido y extensión</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{data.lengthComparison}</p>
          </div>
        </div>
      </div>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Keywords a reforzar</h4>
          <Badge variant="outline" className="ml-auto tabular-nums">
            {data.missingKeywordsForA.length}
          </Badge>
        </div>
        {data.missingKeywordsForA.length === 0 ? (
          <p className="text-sm text-muted-foreground">No se listaron términos concretos; revisa el resumen y los huecos.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {data.missingKeywordsForA.map((k) => (
              <li key={k}>
                <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground">
                  {k}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          <h4 className="font-semibold">Huecos frente al competidor</h4>
        </div>
        <ul className="space-y-2">
          {data.structuralGaps.map((g, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-rose-200/50 bg-rose-50/40 px-3 py-2.5 text-sm dark:border-rose-500/20 dark:bg-rose-950/25"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-xs font-bold text-rose-700 dark:text-rose-300">
                {i + 1}
              </span>
              <span className="leading-snug text-foreground">{g}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-semibold">Qué hacer en tu web</h4>
        </div>
        <ol className="space-y-2">
          {data.actionItemsForA.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-emerald-200/60 bg-emerald-50/35 px-3 py-2.5 text-sm dark:border-emerald-500/25 dark:bg-emerald-950/30"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white dark:bg-emerald-500">
                {i + 1}
              </span>
              <span className="leading-snug text-foreground">{item}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
