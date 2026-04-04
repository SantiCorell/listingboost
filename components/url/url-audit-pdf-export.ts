import type { UrlAuditLlmOutput } from "@/types/url-audit";

type AuditLike = {
  modules?: { creditsCharged?: number; includeFullLlm?: boolean; includeSitemap?: boolean };
  crawl?: { finalUrl?: string };
  scores?: { overallScore: number; byCategory: Record<string, number> };
  issues?: { id: string; severity: string; category: string; message: string }[];
  quickWins?: string[];
  llm?: UrlAuditLlmOutput | null;
};

/** Genera PDF multipágina en el navegador (tras cobrar crédito en servidor). */
export async function downloadUrlAuditPdfClient(output: unknown, filenameBase: string) {
  const { default: jsPDF } = await import("jspdf");
  const data = output as AuditLike;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 44;
  const pageH = doc.internal.pageSize.getHeight();
  const pageW = doc.internal.pageSize.getWidth();
  const maxW = pageW - margin * 2;
  let y = margin;
  const lh = 13;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const title = (t: string) => {
    ensureSpace(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(t, margin, y);
    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  const para = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      ensureSpace(lh);
      doc.text(line, margin, y);
      y += lh;
    }
    y += 6;
  };

  title("ListingBoost · Informe SEO de URL");
  para(`Generado: ${new Date().toLocaleString("es-ES")}`);
  if (data.modules?.creditsCharged != null) {
    para(`Créditos del análisis: ${data.modules.creditsCharged}`);
  }
  para(`URL analizada: ${data.crawl?.finalUrl ?? "—"}`);
  para(`Puntuación global (heurística): ${data.scores?.overallScore ?? "—"} / 100`);

  title("Puntuación por bloques");
  if (data.scores?.byCategory) {
    for (const [k, v] of Object.entries(data.scores.byCategory)) {
      para(`${k}: ${v}`);
    }
  }

  title("Problemas detectados");
  if (data.issues?.length) {
    for (const i of data.issues.slice(0, 40)) {
      para(`[${i.severity}] ${i.category}: ${i.message}`);
    }
  } else {
    para("—");
  }

  title("Quick wins");
  if (data.quickWins?.length) {
    for (const q of data.quickWins) {
      para(`• ${q}`);
    }
  }

  if (data.llm) {
    const llm = data.llm;
    doc.addPage();
    y = margin;
    title("Resumen e intención (IA)");
    para(llm.summary);
    para(`Keyword principal: ${llm.mainKeywordInference}`);
    para(`Intención: ${llm.searchIntent}`);

    title("Metadatos sugeridos");
    para(`Title: ${llm.recommendedTitle}`);
    para(`Meta: ${llm.recommendedMetaDescription}`);
    para(`H1: ${llm.recommendedH1}`);

    title("Acciones priorizadas");
    llm.prioritizedActions.forEach((a, i) => para(`${i + 1}. ${a}`));

    title("Keywords");
    para(llm.suggestedKeywords.join(", "));
    para(`Secundarias: ${llm.secondaryKeywords.join(", ")}`);

    if (llm.gscStyle?.disclaimer) {
      title("Estimación tipo Search Console");
      para(llm.gscStyle.disclaimer);
    }
  } else {
    doc.addPage();
    y = margin;
    title("Informe IA");
    para(
      "Este análisis se ejecutó en modo Esencial: incluye crawl, puntuación y problemas, sin el bloque largo de IA. Vuelve a lanzar con preset Estándar o Completo para copys y priorización con modelo.",
    );
  }

  doc.save(`${filenameBase}.pdf`);
}
