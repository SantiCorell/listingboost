"use client";

import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  Gauge,
  Lightbulb,
  ListOrdered,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

function phaseBadgeClass(phase: string) {
  const p = phase.toLowerCase();
  if (p.includes("inmediat")) return "border-emerald-300/60 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100";
  if (p.includes("corto")) return "border-sky-300/60 bg-sky-50 text-sky-950 dark:bg-sky-950/40 dark:text-sky-100";
  if (p.includes("medio")) return "border-violet-300/60 bg-violet-50 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100";
  return "border-border bg-muted/50";
}

export function SerpCompetitorInsightDialog({
  open,
  onOpenChange,
  data,
  keyword,
  pageUrl,
  creditsUsed,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: SerpCompetitorInsightOutput | null;
  keyword: string;
  pageUrl: string;
  creditsUsed: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,840px)] w-[min(100vw-1.5rem,640px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border/60 bg-gradient-to-r from-violet-500/10 via-sky-500/8 to-transparent px-6 py-4 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="text-lg">Informe SERP vs competidores</DialogTitle>
              <DialogDescription className="text-left">
                Consulta «{keyword}» · {creditsUsed} créditos · análisis orientativo (no garantiza subidas).
              </DialogDescription>
            </div>
          </div>
          <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">{pageUrl}</p>
        </DialogHeader>

        {!data ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Sin datos.</div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  Resumen ejecutivo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {data.executiveSummary}
                </p>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Gauge className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  Contexto de búsqueda
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {data.marketContext}
                </p>
              </section>

              <Separator />

              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  Qué hacen mejor (por encima en Google)
                </h3>
                <ul className="mt-3 space-y-4">
                  {data.competitorCards.map((c, i) => (
                    <li
                      key={`${c.url}-${i}`}
                      className="rounded-xl border border-violet-200/50 bg-violet-50/40 p-4 dark:border-violet-500/20 dark:bg-violet-950/25"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          #{c.serpPosition}
                        </Badge>
                        <span className="break-all text-xs font-medium text-foreground">{c.url}</span>
                      </div>
                      <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
                        {c.strengthsObserved.map((s, j) => (
                          <li key={j}>{s}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm leading-snug text-foreground">{c.whatTheyDoBetter}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Tu página
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {data.yourUrlDiagnosis}
                </p>
              </section>

              <Separator />

              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ListOrdered className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Plan de acción priorizado
                </h3>
                <ol className="mt-4 space-y-4">
                  {[...data.prioritizedActions]
                    .sort((a, b) => a.order - b.order)
                    .map((a) => (
                      <li
                        key={a.order}
                        className="rounded-xl border border-border/70 bg-muted/20 p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                            {a.order}
                          </span>
                          <span className="font-semibold text-foreground">{a.title}</span>
                          <Badge variant="outline" className={`text-[10px] ${phaseBadgeClass(a.phase)}`}>
                            {a.phase.replace(/_/g, " ")}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-normal">
                            Esfuerzo: {a.effortLevel}
                          </Badge>
                        </div>
                        <ul className="mt-2 list-inside list-decimal text-sm text-muted-foreground">
                          {a.steps.map((s, j) => (
                            <li key={j} className="leading-relaxed">
                              {s}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 text-xs text-foreground/90">
                          <strong>Por qué importa:</strong> {a.whyItMatters}
                        </p>
                        <p className="mt-1 text-xs font-medium text-primary">
                          Tiempo estimado hasta efecto: {a.expectedTimeToEffect}
                        </p>
                      </li>
                    ))}
                </ol>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  Métricas a vigilar
                </h3>
                <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                  {data.metricsToWatch.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </section>

              <p className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-3 text-xs text-muted-foreground">
                {data.honestDisclaimer}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
