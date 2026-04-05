"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { CrawlIssue, UrlAuditLlmOutput } from "@/types/url-audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Copy, Download, FileDown, Layers, LineChart, Loader2, ListChecks } from "lucide-react";
import { chargeUrlAuditPdfExport } from "@/actions/url-audit-pdf";
import { CREDIT_URL_AUDIT_PDF } from "@/lib/url-audit/credits-config";
import { downloadUrlAuditPdfClient } from "@/components/url/url-audit-pdf-export";

function clampPct(n: number) {
  return Math.max(0, Math.min(100, n));
}

type SitemapReport = {
  totalUrls: number;
  urlSample: string[];
  truncated: boolean;
  errors: string[];
  origin?: string;
};

type AuditOutput = {
  modules?: {
    creditsCharged?: number;
    includeFullLlm?: boolean;
    includeSitemap?: boolean;
  };
  sitemapReport?: SitemapReport | null;
  crawl: unknown;
  scores: { overallScore: number; byCategory: Record<string, number> };
  issues: CrawlIssue[];
  quickWins: string[];
  llm: UrlAuditLlmOutput | null;
};

function CopyBlock({ label, text }: { label: string; text: string }) {
  const copy = useCallback(() => {
    void navigator.clipboard.writeText(text);
  }, [text]);
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Button type="button" variant="ghost" size="sm" className="h-8" onClick={copy}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="whitespace-pre-wrap text-sm">{text}</p>
    </div>
  );
}

export function UrlAuditResults({
  output,
  auditId,
}: {
  output: unknown;
  auditId?: string;
}) {
  const data = output as AuditOutput;
  const { llm, scores, issues, quickWins } = data;
  const gsc = llm?.gscStyle;
  const sitemap = data.sitemapReport;
  const [pdfMsg, setPdfMsg] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `auditoria-url-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onPdf = async () => {
    if (!auditId) return;
    setPdfMsg(null);
    setPdfBusy(true);
    try {
      const r = await chargeUrlAuditPdfExport(auditId);
      if (!r.ok) {
        setPdfMsg(r.error);
        return;
      }
      await downloadUrlAuditPdfClient(data, `listingboost-audit-${auditId.slice(0, 8)}`);
    } catch {
      setPdfMsg("No se pudo generar el PDF.");
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {sitemap && data.modules?.includeSitemap ? (
        <Card className="border-primary/25 bg-gradient-to-br from-primary/[0.04] to-violet-500/[0.04]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-5 w-5 text-primary" />
              Inventario de sitemaps
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              URLs descubiertas vía robots/sitemaps del mismo dominio (puede estar incompleto vs crawl total).
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-base font-semibold tabular-nums">
                {sitemap.totalUrls.toLocaleString("es-ES")} URLs
              </Badge>
              {sitemap.truncated ? (
                <Badge variant="outline">Recorte por límite de seguridad</Badge>
              ) : null}
            </div>
            {sitemap.errors.length ? (
              <ul className="list-inside list-disc text-xs text-amber-800 dark:text-amber-200">
                {sitemap.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            ) : null}
            {sitemap.urlSample.length ? (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Muestra de URLs</p>
                <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-border/60 bg-muted/30 p-2 font-mono text-[11px] leading-snug">
                  {sitemap.urlSample.slice(0, 25).map((u) => (
                    <li key={u} className="truncate" title={u}>
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Puntuación SEO</CardTitle>
            {llm ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">{llm.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>
                    Keyword inferida:{" "}
                    <span className="font-medium text-foreground">{llm.mainKeywordInference}</span>
                  </span>
                  <span>·</span>
                  <span>Intención: {llm.searchIntent}</span>
                </div>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Modo <strong className="text-foreground">Esencial</strong>: puntuación y diagnóstico técnico sin informe
                largo de IA. Para copys, FAQs y priorización con modelo, vuelve a ejecutar con preset{" "}
                <strong>Estándar</strong> o <strong>Completo</strong>.
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="text-4xl font-bold tabular-nums">{scores.overallScore}</div>
            <p className="text-xs text-muted-foreground">de 100 (heurística on-page)</p>
            {data.modules?.creditsCharged != null ? (
              <Badge variant="outline" className="font-mono text-[10px]">
                {data.modules.creditsCharged} créditos usados
              </Badge>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={downloadJson}>
                <Download className="h-4 w-4" />
                JSON
              </Button>
              {auditId ? (
                <>
                  <Button type="button" variant="default" size="sm" asChild>
                    <Link href={`/dashboard/history/audit/${auditId}/print`} target="_blank">
                      <FileDown className="h-4 w-4" />
                      Imprimir
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={pdfBusy}
                    onClick={() => void onPdf()}
                  >
                    {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                    PDF ({CREDIT_URL_AUDIT_PDF} crédito)
                  </Button>
                </>
              ) : null}
            </div>
            {pdfMsg ? <p className="max-w-xs text-right text-xs text-destructive">{pdfMsg}</p> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {llm && gsc ? (
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-violet-500/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <LineChart className="h-4 w-4 text-primary" />
                Rendimiento estimado (estilo Search Console)
              </div>
              {gsc.disclaimer ? (
                <p className="mb-4 text-xs text-muted-foreground">{gsc.disclaimer}</p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                {gsc.healthVsSimilarPagesPercent != null ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Salud vs páginas similares</span>
                      <span className="font-semibold tabular-nums">
                        {gsc.healthVsSimilarPagesPercent}%
                      </span>
                    </div>
                    <Progress value={clampPct(gsc.healthVsSimilarPagesPercent)} />
                  </div>
                ) : null}
                {gsc.ctrHeadroomPercent != null ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Margen de mejora CTR (estim.)</span>
                      <span className="font-semibold tabular-nums">{gsc.ctrHeadroomPercent}%</span>
                    </div>
                    <Progress value={clampPct(gsc.ctrHeadroomPercent)} className="bg-amber-500/10" />
                  </div>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {gsc.impressionPotential ? (
                  <Badge variant="secondary">Impresiones: {gsc.impressionPotential}</Badge>
                ) : null}
                {gsc.positionBandGuess ? (
                  <Badge variant="outline">Posición estimada: {gsc.positionBandGuess}</Badge>
                ) : null}
              </div>
              {gsc.queriesToTarget?.length ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Consultas a atacar</p>
                  <div className="flex flex-wrap gap-1">
                    {gsc.queriesToTarget.map((q) => (
                      <Badge key={q} variant="outline" className="text-[10px] font-normal">
                        {q}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              {gsc.technicalNotes ? (
                <p className="mt-3 text-xs text-muted-foreground">{gsc.technicalNotes}</p>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(scores.byCategory).map(([k, v]) => (
              <div key={k} className="space-y-1 rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{k}</span>
                  <span className="font-semibold tabular-nums">{v}</span>
                </div>
                <Progress value={clampPct(v)} />
              </div>
            ))}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Problemas detectados</h3>
            <ul className="space-y-2">
              {issues.map((i) => (
                <li
                  key={i.id}
                  className="flex flex-col gap-0.5 rounded-md border border-border/50 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        i.severity === "error"
                          ? "destructive"
                          : i.severity === "warning"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-[10px]"
                    >
                      {i.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{i.category}</span>
                  </div>
                  <span>{i.message}</span>
                  {i.fix ? (
                    <span className="text-xs text-muted-foreground">Fix: {i.fix}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Quick wins</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {quickWins.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>

          {llm ? (
            <>
              {llm.detailedRecommendations && llm.detailedRecommendations.length > 0 ? (
                <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.06] to-primary/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <ListChecks className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    Plan de acción detallado
                  </div>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Qué cambiar, qué sustituir y cómo implementarlo (nivel consultoría). Incluido en el PDF.
                  </p>
                  <ol className="space-y-4">
                    {llm.detailedRecommendations.map((d, idx) => (
                      <li
                        key={idx}
                        className="rounded-lg border border-border/60 bg-background/80 p-3 text-sm"
                      >
                        <p className="font-semibold text-foreground">{d.title}</p>
                        {d.problem ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/90">Situación: </span>
                            {d.problem}
                          </p>
                        ) : null}
                        <p className="mt-2 text-foreground/95">
                          <span className="font-medium text-primary">Propuesta: </span>
                          {d.proposedChange}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">Cómo hacerlo: </span>
                          {d.howToImplement}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              <div>
                <h3 className="mb-2 text-sm font-semibold">Acciones priorizadas</h3>
                <ol className="list-decimal space-y-2 pl-5 text-sm">
                  {llm.prioritizedActions.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ol>
              </div>

              <Separator />

              <div className="grid gap-4 lg:grid-cols-2">
                <CopyBlock label="Title sugerido" text={llm.recommendedTitle} />
                <CopyBlock label="Meta description sugerida" text={llm.recommendedMetaDescription} />
                <CopyBlock label="H1 sugerido" text={llm.recommendedH1} />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Estructura H2 / H3 propuesta</h3>
                <ul className="space-y-2 text-sm">
                  {llm.suggestedHeadings.h2.map((h) => (
                    <li key={h}>
                      <span className="font-medium">{h}</span>
                      {llm.suggestedHeadings.h3ByH2?.[h]?.length ? (
                        <ul className="mt-1 list-inside list-disc pl-4 text-muted-foreground">
                          {llm.suggestedHeadings.h3ByH2[h].map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Keywords</h3>
                  <div className="flex flex-wrap gap-1">
                    {llm.suggestedKeywords.map((k) => (
                      <Badge key={k} variant="secondary">
                        {k}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Secundarias</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {llm.secondaryKeywords.map((k) => (
                      <Badge key={k} variant="outline">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Interlinking</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {llm.interlinkingIdeas.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">FAQs sugeridas</h3>
                <div className="space-y-3">
                  {llm.suggestedFaqs.map((f, i) => (
                    <div key={i} className="rounded-lg border border-border/50 p-3 text-sm">
                      <p className="font-medium">{f.question}</p>
                      <p className="mt-1 text-muted-foreground">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Brechas de contenido</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    {llm.contentGaps.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">CRO básico</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    {llm.conversionSuggestions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Informe guardado en historial. Score basado en heurísticas; la IA prioriza acciones cuando está incluida.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
