"use client";

import { useState } from "react";
import Link from "next/link";
import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";
import { chargeSerpInsightPdfExport } from "@/actions/serp-insight-pdf";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { downloadSerpInsightPdfClient } from "@/components/seo/serp-insight-pdf-export";
import { SerpInsightReportView } from "@/components/seo/serp-insight-report-view";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderOpen, Loader2, Sparkles, FileDown } from "lucide-react";

export function SerpCompetitorInsightDialog({
  open,
  onOpenChange,
  data,
  keyword,
  pageUrl,
  creditsUsed,
  savedReportId,
  positionAtRun,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: SerpCompetitorInsightOutput | null;
  keyword: string;
  pageUrl: string;
  creditsUsed: number;
  /** Tras guardar en servidor; habilita PDF con cobro y enlace fijo al historial. */
  savedReportId: string | null;
  positionAtRun?: number | null;
}) {
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfErr, setPdfErr] = useState<string | null>(null);

  const positionLabel =
    positionAtRun != null && positionAtRun > 0
      ? `Posición orgánica aproximada ~${positionAtRun} para «${keyword}»`
      : "Sin posición clara en el tramo analizado de la SERP para esta consulta";

  async function handlePdf() {
    if (!data || !savedReportId) return;
    setPdfErr(null);
    setPdfBusy(true);
    try {
      const r = await chargeSerpInsightPdfExport(savedReportId);
      if (!r.ok) {
        setPdfErr(r.error);
        return;
      }
      await downloadSerpInsightPdfClient(
        data,
        { keyword, pageUrl, positionLabel },
        `informe-serp-${keyword.replace(/\s+/g, "-").slice(0, 40)}`,
      );
    } catch {
      setPdfErr("No se pudo generar el PDF.");
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,880px)] w-[min(100vw-1.5rem,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-border/60 bg-gradient-to-r from-violet-500/10 via-sky-500/8 to-transparent px-6 py-4 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="text-lg">Informe SERP vs competidores</DialogTitle>
              <DialogDescription className="text-left">
                Consulta «{keyword}» ·{" "}
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

        {!data ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Sin datos.</div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Guardado automáticamente.</strong> Para volver a ver este informe
                más tarde, entra en{" "}
                <Link href="/dashboard/history#informes-serp" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Historial → Informes SERP
                </Link>
                . Desde ahí también puedes descargar el PDF.
              </div>
              <SerpInsightReportView
                data={data}
                keyword={keyword}
                pageUrl={pageUrl}
                positionLabel={positionLabel}
              />
            </div>

            <div className="shrink-0 space-y-2 border-t border-border/60 bg-muted/20 px-6 py-4">
              {pdfErr ? <p className="text-sm text-destructive">{pdfErr}</p> : null}
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {savedReportId ? (
                  <>
                    <Button asChild variant="default" size="sm" className="gap-2">
                      <Link href={`/dashboard/history/serp-insight/${savedReportId}`}>
                        <FolderOpen className="h-4 w-4" />
                        Abrir en historial
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                      disabled={pdfBusy}
                      onClick={() => void handlePdf()}
                    >
                      {pdfBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileDown className="h-4 w-4" />
                      )}
                      PDF ({FEATURE_CREDITS.SERP_INSIGHT_PDF_EXPORT} cr)
                    </Button>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Generando enlace al historial… si no aparece, recarga y abre{" "}
                    <Link href="/dashboard/history#informes-serp" className="text-primary underline-offset-4 hover:underline">
                      Historial
                    </Link>
                    .
                  </p>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                El PDF multipágina cuesta {FEATURE_CREDITS.SERP_INSIGHT_PDF_EXPORT} crédito (misma política que la
                auditoría URL). Plan Enterprise: sin descuento de cupo.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
