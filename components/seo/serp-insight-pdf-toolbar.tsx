"use client";

import { useState } from "react";
import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";
import { chargeSerpInsightPdfExport } from "@/actions/serp-insight-pdf";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { downloadSerpInsightPdfClient } from "@/components/seo/serp-insight-pdf-export";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";

export function SerpInsightPdfToolbar({
  reportId,
  data,
  keyword,
  pageUrl,
  positionLabel,
  filenameBase,
}: {
  reportId: string;
  data: SerpCompetitorInsightOutput;
  keyword: string;
  pageUrl: string;
  positionLabel: string;
  filenameBase: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2"
        disabled={busy}
        onClick={async () => {
          setErr(null);
          setBusy(true);
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
            setBusy(false);
          }
        }}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        Descargar PDF ({FEATURE_CREDITS.SERP_INSIGHT_PDF_EXPORT} cr)
      </Button>
      {err ? <p className="text-sm text-destructive">{err}</p> : null}
    </div>
  );
}
