import type { CompetitorCompareOutput } from "@/types/competitor-compare";

const BRAND = { r: 109, g: 40, b: 217 };
const BRAND_LIGHT = { r: 237, g: 233, b: 254 };
const MUTED = { r: 82, g: 82, b: 91 };
const TEXT = { r: 23, g: 23, b: 23 };

function safeFilenamePart(s: string): string {
  try {
    const u = new URL(s);
    return u.hostname.replace(/[^a-z0-9.-]+/gi, "_").slice(0, 40) || "url";
  } catch {
    return "comparativa";
  }
}

/** PDF en cliente (tras autorizar cobro en servidor si aplica). */
export async function downloadCompetitorComparePdfClient(
  data: CompetitorCompareOutput,
  urlA: string,
  urlB: string,
) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;
  const lh = 12;
  const lhTight = 11;

  let logoData: string | null = null;
  try {
    const res = await fetch("/logo.png");
    if (res.ok) {
      const blob = await res.blob();
      logoData = await new Promise<string | null>((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(typeof r.result === "string" ? r.result : null);
        r.readAsDataURL(blob);
      });
    }
  } catch {
    logoData = null;
  }

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

  const drawCover = () => {
    doc.setFillColor(BRAND_LIGHT.r, BRAND_LIGHT.g, BRAND_LIGHT.b);
    doc.rect(0, 0, pageW, 128, "F");
    doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
    doc.rect(0, 0, pageW, 6, "F");
    y = 40;
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", margin, 26, 36, 36);
      } catch {
        /* ignore */
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    doc.text("ListingBoost", logoData ? margin + 44 : margin, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text("Comparativa SEO ampliada vs competidor", logoData ? margin + 44 : margin, 68);
    y = 100;
    doc.setFontSize(9);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    const dateStr = new Date().toLocaleString("es-ES", {
      dateStyle: "long",
      timeStyle: "short",
    });
    doc.text(`Generado: ${dateStr}`, margin, y);
    y = 140;
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
    doc.line(margin, y - 4, margin + Math.min(280, doc.getTextWidth(t) + 12), y - 4);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
  };

  const paragraph = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      ensureSpace(lhTight);
      doc.text(line, margin, y);
      y += lhTight;
    }
    y += 10;
  };

  const urlBox = (label: string, url: string) => {
    ensureSpace(52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(55, 55, 62);
    doc.text(label, margin, y);
    y += 14;
    doc.setFillColor(248, 248, 250);
    doc.roundedRect(margin, y, maxW, 36, 3, 3, "F");
    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 48);
    const lines = doc.splitTextToSize(url, maxW - 16);
    let yy = y + 12;
    for (const line of lines.slice(0, 3)) {
      doc.text(line, margin + 8, yy);
      yy += 11;
    }
    y = y + 44;
    doc.setFont("helvetica", "normal");
  };

  const bulletBlock = (title: string, items: string[], icon: "dot" | "arrow" | "num") => {
    heading(title, 11.5);
    items.forEach((item, idx) => {
      const prefix =
        icon === "arrow" ? "→ " : icon === "num" ? `${idx + 1}. ` : "• ";
      const lines = doc.splitTextToSize(`${prefix}${item}`, maxW - 10);
      for (const line of lines) {
        ensureSpace(lh);
        doc.text(line, margin + (icon === "arrow" ? 4 : 8), y);
        y += lh;
      }
    });
    y += 8;
  };

  const metricsTable = (d: CompetitorCompareOutput) => {
    heading("Métricas (crawl)", 12);
    const ma = d.metricsA;
    const mb = d.metricsB;
    const rows: string[] = [
      `Palabras — A: ${ma.words} | B: ${mb.words}`,
      `Caracteres — A: ${ma.chars} | B: ${mb.chars}`,
      `H2 / H3 — A: ${ma.h2Count}/${ma.h3Count} | B: ${mb.h2Count}/${mb.h3Count}`,
      `Enlaces int. — A: ${ma.internalLinks} | B: ${mb.internalLinks}`,
      `Enlaces ext. — A: ${ma.externalLinks} | B: ${mb.externalLinks}`,
      `Imágenes sin alt — A: ${ma.imagesMissingAlt} | B: ${mb.imagesMissingAlt}`,
      `JSON-LD A: ${ma.schemaTypes.join(", ") || "—"}`,
      `JSON-LD B: ${mb.schemaTypes.join(", ") || "—"}`,
    ];
    if (d.wordDiffPctBvsA != null) {
      rows.push(`Δ palabras B vs A: ${d.wordDiffPctBvsA >= 0 ? "+" : ""}${d.wordDiffPctBvsA}%`);
    }
    for (const row of rows) {
      paragraph(row);
    }
  };

  drawCover();

  urlBox("Tu página (A)", urlA);
  urlBox("Competidor (B)", urlB);

  metricsTable(data);

  heading("Resumen ejecutivo", 12);
  paragraph(data.executiveSummary);

  heading("Contenido, volumen y profundidad", 12);
  paragraph(data.deepDiveContent);

  heading("Perfil del sitio A", 12);
  paragraph(data.siteAProfile);

  heading("Perfil del sitio B", 12);
  paragraph(data.siteBProfile);

  heading("Cara a cara", 12);
  paragraph(data.headToHead);

  heading("Visibilidad y E-E-A-T (observable)", 12);
  paragraph(data.serpEeatInsight);

  bulletBlock("Prioridades tácticas", data.tacticalPriorities, "num");
  bulletBlock("Keywords y temas a reforzar en A", data.missingKeywordsForA, "dot");
  bulletBlock("Huecos frente al competidor", data.structuralGaps, "dot");
  bulletBlock("Plan de acción recomendado para A", data.actionItemsForA, "arrow");

  ensureSpace(36);
  doc.setFontSize(8);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(
    "Informe generado por ListingBoost · Métricas del crawl en tiempo real; narrativa orientativa.",
    margin,
    pageH - 32,
  );

  const base = `comparativa-${safeFilenamePart(urlA)}-vs-${safeFilenamePart(urlB)}`;
  doc.save(`${base}.pdf`);
}
