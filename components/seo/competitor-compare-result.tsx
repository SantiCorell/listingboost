"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompetitorCompareOutput } from "@/types/competitor-compare";
import { chargeCompetitorPdfExport } from "@/actions/competitor-pdf";
import { downloadCompetitorComparePdfClient } from "@/components/seo/competitor-pdf-export";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  FileDown,
  GitCompare,
  KeyRound,
  Layers,
  Loader2,
  Radar,
  Shield,
  Sparkles,
  Swords,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

function hostLabel(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function MetricCard({
  label,
  a,
  b,
  format = (n: number) => String(n),
}: {
  label: string;
  a: number;
  b: number;
  format?: (n: number) => string;
}) {
  const better: "a" | "b" | "tie" =
    a === b ? "tie" : label.includes("sin alt") || label.includes("externos")
      ? a < b
        ? "a"
        : "b"
      : a > b
        ? "a"
        : "b";
  return (
    <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div>
          <span className="text-xs text-violet-600 dark:text-violet-400">A</span>
          <p
            className={`text-sm font-semibold tabular-nums ${better === "a" ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}
          >
            {format(a)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-600 dark:text-slate-400">B</span>
          <p
            className={`text-sm font-semibold tabular-nums ${better === "b" ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}
          >
            {format(b)}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProseBlock({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold tracking-tight text-foreground">{title}</h4>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_p+p]:mt-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Parte párrafos por líneas en blanco para lectura en pantalla. */
function SplitParagraphs({ text }: { text: string }) {
  const parts = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {p}
        </p>
      ))}
    </>
  );
}

export function CompetitorCompareResult({
  data,
  urlA,
  urlB,
  pdfExportFree,
}: {
  data: CompetitorCompareOutput;
  urlA: string;
  urlB: string;
  pdfExportFree: boolean;
}) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfErr, setPdfErr] = useState<string | null>(null);
  const la = hostLabel(urlA);
  const lb = hostLabel(urlB);
  const { metricsA: ma, metricsB: mb } = data;
  const pct = data.wordDiffPctBvsA;

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
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitCompare className="h-4 w-4 text-primary" />
          <span>Informe competitivo ampliado</span>
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 to-background p-4 dark:border-violet-500/25 dark:from-violet-950/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Tu URL (A)</p>
          <p className="mt-1 break-all font-mono text-sm text-foreground">{urlA}</p>
          <p className="mt-1 text-xs text-muted-foreground">{la}</p>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 to-background p-4 dark:border-slate-600/40 dark:from-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Competidor (B)</p>
          <p className="mt-1 break-all font-mono text-sm text-foreground">{urlB}</p>
          <p className="mt-1 text-xs text-muted-foreground">{lb}</p>
        </div>
      </div>

      {/* Métricas comparativas (reales) */}
      <Card className="border-primary/15 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Métricas de la página (crawl)</CardTitle>
            <Badge variant="outline" className="ml-auto font-mono text-xs">
              {pct == null ? "Δ palabras n/d" : `Δ palabras B vs A: ${pct >= 0 ? "+" : ""}${pct}%`}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Cifras calculadas en servidor; el informe narrativo debajo las interpreta en contexto SEO.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Palabras (aprox.)" a={ma.words} b={mb.words} />
            <MetricCard label="Caracteres de texto" a={ma.chars} b={mb.chars} />
            <MetricCard label="Encabezados H2" a={ma.h2Count} b={mb.h2Count} />
            <MetricCard label="Encabezados H3" a={ma.h3Count} b={mb.h3Count} />
            <MetricCard label="Enlaces internos" a={ma.internalLinks} b={mb.internalLinks} />
            <MetricCard label="Enlaces externos" a={ma.externalLinks} b={mb.externalLinks} />
            <MetricCard label="Imágenes sin alt" a={ma.imagesMissingAlt} b={mb.imagesMissingAlt} />
            <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 sm:col-span-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">JSON-LD (tipos)</p>
              <p className="mt-1 text-xs leading-snug text-foreground">
                <span className="font-medium text-violet-700 dark:text-violet-300">A:</span>{" "}
                {ma.schemaTypes.length ? ma.schemaTypes.join(", ") : "—"}
              </p>
              <p className="mt-1 text-xs leading-snug text-foreground">
                <span className="font-medium text-slate-600 dark:text-slate-400">B:</span>{" "}
                {mb.schemaTypes.length ? mb.schemaTypes.join(", ") : "—"}
              </p>
            </div>
          </div>
          {pct != null ? (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2 text-xs text-amber-950 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-100">
              {pct > 0 ? (
                <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />
              ) : pct < 0 ? (
                <TrendingDown className="h-4 w-4 shrink-0" aria-hidden />
              ) : null}
              <span>
                B tiene{" "}
                <strong>
                  {pct > 0 ? "más" : pct < 0 ? "menos" : "el mismo volumen aproximado de"}
                </strong>{" "}
                texto que A ({pct >= 0 ? "+" : ""}
                {pct}% palabras). Crucial para cobertura de intención y términos de cola larga.
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-background to-violet-500/[0.06] p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Resumen ejecutivo</h3>
            <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
              <SplitParagraphs text={data.executiveSummary} />
            </div>
          </div>
        </div>
      </div>

      <ProseBlock title="Contenido, volumen y profundidad temática" icon={BookOpen}>
        <SplitParagraphs text={data.deepDiveContent} />
      </ProseBlock>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProseBlock title={`Perfil de ${la} (A)`} icon={Layers}>
          <SplitParagraphs text={data.siteAProfile} />
        </ProseBlock>
        <ProseBlock title={`Perfil de ${lb} (B)`} icon={Layers}>
          <SplitParagraphs text={data.siteBProfile} />
        </ProseBlock>
      </div>

      <ProseBlock title="Cara a cara: quién gana en qué" icon={Swords}>
        <SplitParagraphs text={data.headToHead} />
      </ProseBlock>

      <ProseBlock title="Visibilidad, intención y señales de confianza (E-E-A-T observable)" icon={Radar}>
        <SplitParagraphs text={data.serpEeatInsight} />
      </ProseBlock>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <h4 className="font-semibold">Prioridades tácticas (orden sugerido)</h4>
        </div>
        <ol className="space-y-2">
          {data.tacticalPriorities.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-amber-200/50 bg-amber-50/40 px-3 py-2.5 text-sm dark:border-amber-500/20 dark:bg-amber-950/25"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-600 text-xs font-bold text-white dark:bg-amber-500">
                {i + 1}
              </span>
              <span className="leading-snug text-foreground">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Keywords y temas a reforzar en A</h4>
          <Badge variant="outline" className="ml-auto tabular-nums">
            {data.missingKeywordsForA.length}
          </Badge>
        </div>
        {data.missingKeywordsForA.length === 0 ? (
          <p className="text-sm text-muted-foreground">No se listaron términos.</p>
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
          <h4 className="font-semibold">Plan de acción en tu web (A)</h4>
          <Badge variant="secondary" className="ml-auto tabular-nums">
            {data.actionItemsForA.length} pasos
          </Badge>
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

      <div className="flex items-start gap-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-3 text-xs text-muted-foreground">
        <Shield className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Las métricas numéricas provienen del crawl en el momento del análisis. La narrativa es inferencia
          profesional a partir del contenido visible; no sustituye a Search Console ni a datos internos del
          competidor.
        </p>
      </div>
    </div>
  );
}
