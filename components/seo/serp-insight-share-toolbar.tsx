"use client";

import { useState } from "react";
import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";
import { chargeSerpInsightPdfExport } from "@/actions/serp-insight-pdf";
import { sendSerpInsightReportEmailAction } from "@/actions/send-serp-insight-email";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { downloadSerpInsightPdfClient } from "@/components/seo/serp-insight-pdf-export";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function SerpInsightShareToolbar({
  reportId,
  data,
  keyword,
  pageUrl,
  positionLabel,
  filenameBase,
  className,
}: {
  reportId: string;
  data: SerpCompetitorInsightOutput;
  keyword: string;
  pageUrl: string;
  positionLabel: string;
  filenameBase: string;
  className?: string;
}) {
  const [pdfBusy, setPdfBusy] = useState(false);
  const [mailBusy, setMailBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mailOk, setMailOk] = useState(false);

  async function doPdf() {
    setErr(null);
    setMailOk(false);
    setPdfBusy(true);
    try {
      const r = await chargeSerpInsightPdfExport(reportId);
      if (!r.ok) {
        setErr(r.error);
        return;
      }
      await downloadSerpInsightPdfClient(data, { keyword, pageUrl, positionLabel }, filenameBase);
    } catch {
      setErr("No se pudo generar el PDF.");
    } finally {
      setPdfBusy(false);
    }
  }

  async function doMail() {
    setErr(null);
    setMailOk(false);
    setMailBusy(true);
    try {
      const r = await sendSerpInsightReportEmailAction(reportId);
      if (!r.ok) {
        setErr(r.error);
        return;
      }
      setMailOk(true);
    } catch {
      setErr("No se pudo enviar el correo.");
    } finally {
      setMailBusy(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center", className)}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2 shadow-sm"
        disabled={pdfBusy || mailBusy}
        onClick={() => void doPdf()}
      >
        {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        PDF en pantalla ({FEATURE_CREDITS.SERP_INSIGHT_PDF_EXPORT} cr)
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 border-violet-300/50"
        disabled={pdfBusy || mailBusy}
        onClick={() => void doMail()}
      >
        {mailBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Enviar enlace por email
      </Button>
      {mailOk ? (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Revisa tu bandeja (y spam).</p>
      ) : null}
      {err ? <p className="w-full text-sm text-destructive">{err}</p> : null}
      <p className="w-full text-[11px] text-muted-foreground">
        El PDF se descarga aquí; el correo solo envía un <strong className="text-foreground">enlace</strong> para volver al
        informe cuando quieras.
      </p>
    </div>
  );
}
