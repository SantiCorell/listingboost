import type { jsPDF } from "jspdf";
import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";
import { APP_NAME } from "@/lib/constants";
import { getBrandMarkPngDataUrl } from "@/lib/pdf/brand-mark-png";

const BRAND = { r: 109, g: 40, b: 217 };
const BRAND_LIGHT = { r: 237, g: 233, b: 254 };
const MUTED = { r: 82, g: 82, b: 91 };
const TEXT = { r: 23, g: 23, b: 23 };

function heading(doc: jsPDF, text: string, y: number, margin: number, maxW: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
  const lines = doc.splitTextToSize(text, maxW);
  doc.text(lines, margin, y);
  return y + lines.length * 13 + 6;
}

function body(doc: jsPDF, text: string, y: number, margin: number, maxW: number, pageH: number): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  const lines = doc.splitTextToSize(text || "—", maxW);
  const lh = 11;
  for (const line of lines) {
    if (y + lh > pageH - 40) {
      doc.addPage();
      y = 48;
    }
    doc.text(line, margin, y);
    y += lh;
  }
  return y + 8;
}

export async function downloadSerpInsightPdfClient(
  data: SerpCompetitorInsightOutput,
  meta: { keyword: string; pageUrl: string; positionLabel?: string | null },
  filenameBase: string,
) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;

  const logoData = await getBrandMarkPngDataUrl(64);

  const drawFooter = (pageIndex: number, total: number) => {
    doc.setFontSize(8);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(`${APP_NAME} · Informe SERP · Página ${pageIndex} / ${total}`, margin, pageH - 28);
  };

  const ensureBottom = (needed: number) => {
    if (y + needed > pageH - 44) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFillColor(BRAND_LIGHT.r, BRAND_LIGHT.g, BRAND_LIGHT.b);
  doc.rect(0, 0, pageW, 110, "F");
  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(0, 0, pageW, 6, "F");
  y = 36;
  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", margin, 24, 32, 32);
    } catch {
      /* ignore */
    }
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
  doc.text("Informe SERP vs competidores", logoData ? margin + 44 : margin, 44);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(`Consulta: «${meta.keyword}»`, logoData ? margin + 44 : margin, 60);
  y = 100;
  y = body(doc, meta.pageUrl, y, margin, maxW, pageH);
  if (meta.positionLabel) {
    y = body(doc, `Situación en SERP: ${meta.positionLabel}`, y, margin, maxW, pageH);
  }

  const sections: [string, string][] = [
    ["Resumen ejecutivo", data.executiveSummary],
    ["Contexto de búsqueda", data.marketContext],
    ["Cómo encaja en Google (marco realista)", data.howGoogleEvaluatesThisQuery],
    ["Lo que tienen por encima y tú aún no", data.whatTopResultsDoThatYouDont],
    ["Volatilidad y plazos realistas", data.volatilityAndRealisticTimelines],
  ];

  for (const [title, content] of sections) {
    ensureBottom(40);
    y = heading(doc, title, y, margin, maxW);
    y = body(doc, content, y, margin, maxW, pageH);
  }

  ensureBottom(50);
  y = heading(doc, "Competidores (detalle)", y, margin, maxW);
  for (const c of data.competitorCards) {
    ensureBottom(60);
    y = heading(doc, `#${c.serpPosition} ${c.url}`, y, margin, maxW);
    y = body(doc, c.strengthsObserved.map((s) => `• ${s}`).join("\n"), y, margin, maxW, pageH);
    y = body(doc, c.whatTheyDoBetter, y, margin, maxW, pageH);
  }

  ensureBottom(50);
  y = heading(doc, "Tu página", y, margin, maxW);
  y = body(doc, data.yourUrlDiagnosis, y, margin, maxW, pageH);

  ensureBottom(50);
  y = heading(doc, "Plan de acción priorizado", y, margin, maxW);
  for (const a of [...data.prioritizedActions].sort((x, z) => x.order - z.order)) {
    ensureBottom(50);
    y = heading(doc, `${a.order}. ${a.title} (${a.phase.replace(/_/g, " ")}, esfuerzo ${a.effortLevel})`, y, margin, maxW);
    y = body(doc, a.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"), y, margin, maxW, pageH);
    y = body(doc, `Por qué importa: ${a.whyItMatters}\nTiempo orientativo: ${a.expectedTimeToEffect}`, y, margin, maxW, pageH);
  }

  ensureBottom(40);
  y = heading(doc, "Métricas a vigilar", y, margin, maxW);
  y = body(doc, data.metricsToWatch.map((m) => `• ${m}`).join("\n"), y, margin, maxW, pageH);
  ensureBottom(30);
  y = body(doc, data.honestDisclaimer, y, margin, maxW, pageH);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  const safe = filenameBase.replace(/[^\w\-]+/g, "_").slice(0, 80);
  doc.save(`${safe || "informe-serp"}.pdf`);
}
