import type { UrlAuditLlmOutput } from "@/types/url-audit";
import { getBrandMarkPngDataUrl } from "@/lib/pdf/brand-mark-png";

type AuditLike = {
  modules?: { creditsCharged?: number; includeFullLlm?: boolean; includeSitemap?: boolean };
  crawl?: { finalUrl?: string; title?: string | null };
  sitemapReport?: {
    totalUrls: number;
    urlSample: string[];
    truncated: boolean;
    errors: string[];
  } | null;
  scores?: { overallScore: number; byCategory: Record<string, number> };
  issues?: { id: string; severity: string; category: string; message: string; fix?: string }[];
  quickWins?: string[];
  llm?: UrlAuditLlmOutput | null;
};

const BRAND = { r: 109, g: 40, b: 217 };
const BRAND_LIGHT = { r: 237, g: 233, b: 254 };
const MUTED = { r: 82, g: 82, b: 91 };
const TEXT = { r: 23, g: 23, b: 23 };

const CAT_LABEL: Record<string, string> = {
  metadatos: "Metadatos & SERP",
  headings: "Encabezados (H1–H3)",
  imágenes: "Imágenes & medios",
  enlazado: "Enlazado interno/externo",
  estructura: "Estructura & datos estructurados",
  contenido: "Contenido visible",
  ecommerce: "E‑commerce / conversión",
};

function catLabel(key: string): string {
  return CAT_LABEL[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

function severityRgb(sev: string): { r: number; g: number; b: number } {
  if (sev === "error") return { r: 185, g: 28, b: 28 };
  if (sev === "warning") return { r: 180, g: 120, b: 0 };
  return { r: 37, g: 99, b: 235 };
}

/** Genera PDF multipágina en el navegador (tras cobrar crédito en servidor). */
export async function downloadUrlAuditPdfClient(output: unknown, filenameBase: string) {
  const { default: jsPDF } = await import("jspdf");
  const data = output as AuditLike;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;
  const lh = 12;
  const lhTight = 11;

  const logoData = await getBrandMarkPngDataUrl(72);

  function drawThinHeader() {
    doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
    doc.rect(0, 0, pageW, 6, "F");
    doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
    doc.setLineWidth(0.5);
    doc.line(margin, 22, pageW - margin, 22);
    y = Math.max(y, 36);
  }

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin - 28) {
      doc.addPage();
      y = margin;
      drawThinHeader();
    }
  };

  const drawCoverBand = () => {
    doc.setFillColor(BRAND_LIGHT.r, BRAND_LIGHT.g, BRAND_LIGHT.b);
    doc.rect(0, 0, pageW, 120, "F");
    doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
    doc.rect(0, 0, pageW, 6, "F");
    y = 42;
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", margin, 28, 36, 36);
      } catch {
        /* ignore */
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    doc.text("ListingBoost", logoData ? margin + 44 : margin, 52);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text("Informe profesional de SEO on-page (URL única)", logoData ? margin + 44 : margin, 70);
    y = 132;
  };

  const heading = (t: string, size = 13) => {
    ensureSpace(36);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    doc.text(t, margin, y);
    y += size + 6;
    doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
    doc.setLineWidth(0.75);
    doc.line(margin, y - 4, margin + Math.min(160, doc.getTextWidth(t) + 8), y - 4);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
  };

  const subheading = (t: string) => {
    ensureSpace(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(55, 55, 62);
    doc.text(t, margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
  };

  const paragraph = (text: string, opts?: { size?: number; color?: typeof TEXT }) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(opts?.size ?? 10);
    const c = opts?.color ?? TEXT;
    doc.setTextColor(c.r, c.g, c.b);
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      ensureSpace(lhTight);
      doc.text(line, margin, y);
      y += lhTight;
    }
    y += 8;
  };

  const bulletList = (items: string[], maxItems = 80) => {
    for (const item of items.slice(0, maxItems)) {
      const lines = doc.splitTextToSize(`• ${item}`, maxW - 12);
      for (const line of lines) {
        ensureSpace(lh);
        doc.text(line, margin + 6, y);
        y += lh;
      }
    }
    y += 6;
  };

  const scoreBar = (label: string, value: number) => {
    ensureSpace(28);
    const barW = maxW;
    const barH = 10;
    const x = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(55, 55, 62);
    doc.text(`${label}`, x, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${value}`, x + barW - 24, y);
    y += 12;
    doc.setFillColor(230, 230, 235);
    doc.roundedRect(x, y, barW, barH, 2, 2, "F");
    const pct = Math.max(0, Math.min(100, value));
    doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
    doc.roundedRect(x, y, (barW * pct) / 100, barH, 2, 2, "F");
    y += barH + 10;
  };

  const overallGauge = (score: number) => {
    ensureSpace(52);
    subheading("Puntuación global (heurística on-page)");
    const r = 38;
    const cx = margin + r + 8;
    const cy = y + r;
    doc.setDrawColor(220, 220, 228);
    doc.setLineWidth(3);
    doc.circle(cx, cy, r, "S");
    doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
    const sweep = (Math.PI * 2 * score) / 100 - Math.PI / 2;
    const x2 = cx + r * Math.cos(sweep);
    const y2 = cy + r * Math.sin(sweep);
    doc.line(cx, cy, x2, y2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    doc.text(String(score), cx - doc.getTextWidth(String(score)) / 2, cy + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text("/ 100", cx + 18, cy + 6);
    y = cy + r + 18;
  };

  // — Portada / cabecera
  drawCoverBand();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
  paragraph(`Generado: ${new Date().toLocaleString("es-ES", { dateStyle: "long", timeStyle: "medium" })}`, {
    size: 9,
    color: MUTED,
  });
  if (data.modules?.creditsCharged != null) {
    paragraph(`Créditos consumidos en el análisis: ${data.modules.creditsCharged}`, { size: 9, color: MUTED });
  }
  paragraph(`URL analizada: ${data.crawl?.finalUrl ?? "—"}`, {});

  if (data.scores?.overallScore != null) {
    overallGauge(data.scores.overallScore);
  }

  heading("Resumen ejecutivo");
  if (data.llm?.summary) {
    paragraph(data.llm.summary);
    paragraph(
      `Keyword principal inferida: ${data.llm.mainKeywordInference} · Intención: ${data.llm.searchIntent}`,
      { size: 9, color: MUTED },
    );
  } else {
    paragraph(
      "Este informe combina reglas heurísticas sobre el HTML analizado. Para copys, FAQs y roadmap ampliado con IA, ejecuta el análisis con preset Estándar o Completo.",
    );
  }

  if (data.llm?.gscStyle) {
    const g = data.llm.gscStyle;
    heading("Indicadores estimados (estilo Search Console)", 12);
    if (g.disclaimer) paragraph(g.disclaimer, { size: 9, color: MUTED });
    const bits: string[] = [];
    if (g.healthVsSimilarPagesPercent != null)
      bits.push(`Salud vs páginas similares: ${g.healthVsSimilarPagesPercent}%`);
    if (g.ctrHeadroomPercent != null) bits.push(`Margen CTR estimado: ${g.ctrHeadroomPercent}%`);
    if (g.impressionPotential) bits.push(`Potencial de impresiones: ${g.impressionPotential}`);
    if (g.positionBandGuess) bits.push(`Banda de posición estimada: ${g.positionBandGuess}`);
    if (g.queriesToTarget?.length) bits.push(`Consultas a trabajar: ${g.queriesToTarget.join(", ")}`);
    if (g.technicalNotes) bits.push(`Notas: ${g.technicalNotes}`);
    if (bits.length) bulletList(bits);
  }

  heading("Puntuación por bloques");
  if (data.scores?.byCategory) {
    for (const [k, v] of Object.entries(data.scores.byCategory)) {
      scoreBar(catLabel(k), v);
    }
  }

  heading("Diagnóstico técnico");
  if (data.issues?.length) {
    for (const i of data.issues.slice(0, 45)) {
      const rgb = severityRgb(i.severity);
      ensureSpace(36);
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.roundedRect(margin, y - 8, 52, 14, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text(i.severity.toUpperCase(), margin + 6, y + 2);
      doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`${i.category}`, margin + 58, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const msgLines = doc.splitTextToSize(i.message, maxW);
      for (const line of msgLines) {
        ensureSpace(lh);
        doc.text(line, margin, y);
        y += lh;
      }
      if (i.fix) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(60, 110, 70);
        const fixLines = doc.splitTextToSize(`Cómo corregir: ${i.fix}`, maxW);
        for (const line of fixLines) {
          ensureSpace(lh);
          doc.text(line, margin, y);
          y += lh;
        }
        doc.setFont("helvetica", "normal");
        doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
      }
      y += 8;
    }
  } else {
    paragraph("No se detectaron incidencias categorizadas.");
  }

  heading("Quick wins");
  if (data.quickWins?.length) {
    bulletList(data.quickWins);
  } else {
    paragraph("—");
  }

  if (data.llm) {
    const llm = data.llm;
    const detailed = llm.detailedRecommendations;

    heading("Plan de acción — recomendaciones detalladas");
    if (detailed?.length) {
      for (const d of detailed) {
        subheading(d.title);
        if (d.problem) paragraph(`Situación actual: ${d.problem}`);
        paragraph(`Propuesta: ${d.proposedChange}`);
        paragraph(`Implementación: ${d.howToImplement}`);
      }
    } else {
      paragraph(
        "Las recomendaciones granularizadas (situación / propuesta / implementación) se incluyen cuando el modelo las devuelve en análisis recientes. Mientras tanto, usa la lista priorizada siguiente.",
      );
    }

    heading("Acciones priorizadas (orden sugerido)");
    llm.prioritizedActions.forEach((a, i) => {
      paragraph(`${i + 1}. ${a}`);
    });

    heading("Metadatos & copys sugeridos");
    subheading("Title");
    paragraph(llm.recommendedTitle);
    subheading("Meta description");
    paragraph(llm.recommendedMetaDescription);
    subheading("H1");
    paragraph(llm.recommendedH1);

    heading("Estructura de contenido propuesta (H2 / H3)");
    for (const h2 of llm.suggestedHeadings.h2) {
      subheading(h2);
      const subs = llm.suggestedHeadings.h3ByH2?.[h2];
      if (subs?.length) {
        bulletList(subs);
      }
    }

    heading("Palabras clave");
    paragraph(`Principales: ${llm.suggestedKeywords.join(", ")}`);
    paragraph(`Secundarias: ${llm.secondaryKeywords.join(", ")}`);

    heading("Ideas de interlinking");
    bulletList(llm.interlinkingIdeas);

    heading("FAQs sugeridas");
    for (const f of llm.suggestedFaqs) {
      subheading(f.question);
      paragraph(f.answer);
    }

    heading("Brechas de contenido");
    bulletList(llm.contentGaps);

    heading("Optimización de conversión (CRO)");
    bulletList(llm.conversionSuggestions);
  } else {
    ensureSpace(40);
    heading("Bloque IA no incluido");
    paragraph(
      "El análisis se ejecutó en modo Esencial: hay crawl, puntuación y diagnóstico, sin el informe largo de IA. Vuelve a lanzar con preset Estándar o Completo para copys, FAQs, plan detallado y priorización con modelo.",
    );
  }

  if (data.sitemapReport && data.modules?.includeSitemap) {
    heading("Inventario de sitemaps (mismo dominio)");
    const sm = data.sitemapReport;
    paragraph(`URLs estimadas en sitemap: ${sm.totalUrls.toLocaleString("es-ES")}`);
    if (sm.errors.length) bulletList(sm.errors.map((e) => `Aviso: ${e}`));
    if (sm.urlSample.length) {
      subheading("Muestra de URLs");
      bulletList(sm.urlSample.slice(0, 40));
    }
    if (sm.truncated) paragraph("Lista truncada por límite de seguridad.", { size: 9, color: MUTED });
  }

  heading("Nota legal");
  paragraph(
    "Las puntuaciones son heurísticas automáticas sobre el HTML analizado en la fecha del informe. No constituyen garantía de posicionamiento. Las estimaciones tipo Search Console son inferencias del modelo, no datos reales de Google.",
    { size: 8.5, color: MUTED },
  );

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(`ListingBoost · Confidencial · Página ${i} / ${totalPages}`, margin, pageH - 28);
    doc.text("listingboost.es", pageW - margin - doc.getTextWidth("listingboost.es"), pageH - 28);
  }

  doc.save(`${filenameBase}.pdf`);
}
