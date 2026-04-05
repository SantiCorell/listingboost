"use client";

import Link from "next/link";
import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";
import { SerpInsightReportView } from "@/components/seo/serp-insight-report-view";
import { SerpInsightShareToolbar } from "@/components/seo/serp-insight-share-toolbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FolderOpen, Loader2, Zap } from "lucide-react";
import { FEATURE_CREDITS } from "@/lib/feature-credits";

export function SerpCompetitorInsightDialog({
  open,
  onOpenChange,
  data,
  keyword,
  pageUrl,
  creditsUsed,
  savedReportId,
  positionAtRun,
  isGenerating,
  generateError,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: SerpCompetitorInsightOutput | null;
  keyword: string;
  pageUrl: string;
  creditsUsed: number;
  savedReportId: string | null;
  positionAtRun?: number | null;
  /** Mientras el servidor analiza la SERP y redacta el informe. */
  isGenerating?: boolean;
  /** Error de red o del API al generar. */
  generateError?: string | null;
}) {
  const positionLabel =
    positionAtRun != null && positionAtRun > 0
      ? `Posición orgánica aproximada ~${positionAtRun} para «${keyword}»`
      : "Sin posición clara en el tramo analizado de la SERP para esta consulta";

  const filenameBase = `informe-serp-${keyword.replace(/\s+/g, "-").slice(0, 40)}`;

  const showLoading = Boolean(isGenerating && !data);
  const showError = Boolean(!isGenerating && generateError && !data);
  const showReport = Boolean(data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose
        className="fixed left-0 top-0 z-[200] flex h-[100dvh] max-h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 shadow-2xl sm:left-[50%] sm:top-[50%] sm:h-[min(92vh,880px)] sm:max-h-[min(92vh,880px)] sm:w-[min(100vw-1.5rem,720px)] sm:max-w-3xl sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:border sm:border-border/80"
      >
        <DialogHeader className="shrink-0 border-b border-border/60 bg-gradient-to-r from-violet-500/10 via-sky-500/8 to-transparent px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] text-left sm:px-6 sm:pt-4">
          <div className="flex flex-wrap items-center gap-2 pr-10 sm:pr-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <Zap className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-lg">Informe SERP vs competidores</DialogTitle>
              <DialogDescription className="text-left">
                {keyword ? (
                  <>
                    Consulta «{keyword}» ·{" "}
                  </>
                ) : null}
                {creditsUsed === 0 ? (
                  <>sin descuento de cupo en tu plan · </>
                ) : (
                  <>
                    {creditsUsed} créditos ·{" "}
                  </>
                )}
                análisis orientativo (no garantiza subidas).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {showLoading ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-violet-600 dark:text-violet-400" aria-hidden />
            <div className="max-w-sm space-y-2">
              <p className="text-base font-semibold text-foreground">Generando tu informe…</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Rastreamos la SERP, leemos las URLs que van por delante y la IA redacta el análisis.{" "}
                <strong className="text-foreground">Suele tardar entre 2 y 5 minutos</strong>; en picos de carga puede
                alargarse un poco más. Puedes cerrar esta ventana: el informe quedará en{" "}
                <Link
                  href="/dashboard/history#informes-serp"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Historial → Informes SERP
                </Link>{" "}
                cuando termine.
              </p>
            </div>
          </div>
        ) : null}

        {showError ? (
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 px-6 py-8">
            <p className="text-sm text-destructive">{generateError}</p>
            <p className="text-sm text-muted-foreground">
              Si ya se descontaron créditos y ves error, revisa{" "}
              <Link href="/dashboard/history#informes-serp" className="font-medium text-primary underline-offset-4 hover:underline">
                Historial → Informes SERP
              </Link>{" "}
              por si el informe se guardó igualmente.
            </p>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        ) : null}

        {showReport && data ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
              <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-3 text-sm leading-relaxed text-muted-foreground sm:px-4">
                <strong className="text-foreground">Guardado automáticamente.</strong> Vuelve cuando quieras desde{" "}
                <Link
                  href="/dashboard/history#informes-serp"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Historial → Informes SERP
                </Link>
                . Ahí tienes la misma vista, <strong className="text-foreground">PDF en pantalla</strong> (coste en
                créditos) y, si lo necesitas, <strong className="text-foreground">envío opcional por correo</strong>{" "}
                con enlace al informe (no adjuntamos PDF).
              </div>
              <SerpInsightReportView
                hideBrandRail
                data={data}
                keyword={keyword}
                pageUrl={pageUrl}
                positionLabel={positionLabel}
              />
            </div>

            <div className="shrink-0 space-y-3 border-t border-border/60 bg-muted/20 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
              {/* Desktop: todo visible */}
              <div className="hidden sm:block space-y-3">
                {savedReportId ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild variant="default" size="sm" className="gap-2">
                        <Link href={`/dashboard/history/serp-insight/${savedReportId}`}>
                          <FolderOpen className="h-4 w-4" />
                          Abrir en historial
                        </Link>
                      </Button>
                    </div>
                    <SerpInsightShareToolbar
                      reportId={savedReportId}
                      data={data}
                      keyword={keyword}
                      pageUrl={pageUrl}
                      positionLabel={positionLabel}
                      filenameBase={filenameBase}
                    />
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Generando enlace al historial… Si no aparece el PDF en unos segundos, recarga y abre{" "}
                    <Link href="/dashboard/history#informes-serp" className="text-primary underline-offset-4 hover:underline">
                      Historial
                    </Link>
                    .
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  El PDF multipágina cuesta {FEATURE_CREDITS.SERP_INSIGHT_PDF_EXPORT} crédito (misma política que la
                  auditoría URL). Plan Enterprise: sin descuento de cupo.
                </p>
              </div>

              {/* Móvil: acordeón por secciones */}
              <div className="sm:hidden">
                {savedReportId ? (
                  <Accordion type="multiple" defaultValue={["historial", "exportar"]} className="w-full">
                    <AccordionItem value="historial" className="border-violet-200/40 dark:border-violet-500/20">
                      <AccordionTrigger className="py-3 text-sm font-semibold text-foreground hover:no-underline">
                        Historial y enlace fijo
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-3 text-xs leading-relaxed">
                          Este informe tiene URL propia; guárdala o úsala desde el panel.
                        </p>
                        <Button asChild variant="default" size="sm" className="w-full gap-2">
                          <Link href={`/dashboard/history/serp-insight/${savedReportId}`}>
                            <FolderOpen className="h-4 w-4" />
                            Abrir página del informe
                          </Link>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="exportar" className="border-violet-200/40 dark:border-violet-500/20">
                      <AccordionTrigger className="py-3 text-sm font-semibold text-foreground hover:no-underline">
                        PDF en pantalla y correo (opcional)
                      </AccordionTrigger>
                      <AccordionContent>
                        <SerpInsightShareToolbar
                          reportId={savedReportId}
                          data={data}
                          keyword={keyword}
                          pageUrl={pageUrl}
                          positionLabel={positionLabel}
                          filenameBase={filenameBase}
                          className="flex flex-col"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="creditos" className="border-violet-200/40 dark:border-violet-500/20">
                      <AccordionTrigger className="py-3 text-sm font-semibold text-foreground hover:no-underline">
                        Créditos y política
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          El PDF cuesta {FEATURE_CREDITS.SERP_INSIGHT_PDF_EXPORT} crédito. El correo solo manda un enlace;
                          el PDF siempre lo descargas tú en la web cuando quieras.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Generando enlace al historial… Si tarda, abre{" "}
                    <Link href="/dashboard/history#informes-serp" className="text-primary underline-offset-4 hover:underline">
                      Historial → Informes SERP
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
