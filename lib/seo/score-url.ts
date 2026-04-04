import type { ParsedUrlSummary } from "@/services/url/crawler";
import type { CrawlIssue, ScoresByCategory } from "@/types/url-audit";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export type ScoreResult = {
  overallScore: number;
  scoresByCategory: ScoresByCategory;
  issues: CrawlIssue[];
  quickWins: string[];
};

function titleScore(title: string | null): {
  score: number;
  issues: CrawlIssue[];
} {
  const issues: CrawlIssue[] = [];
  if (!title) {
    issues.push({
      id: "title-missing",
      severity: "error",
      category: "metadatos",
      message: "No hay etiqueta <title>.",
      fix: "Añade un título único de 50–60 caracteres con la keyword principal al inicio.",
    });
    return { score: 0, issues };
  }
  const len = title.length;
  if (len < 30) {
    issues.push({
      id: "title-short",
      severity: "warning",
      category: "metadatos",
      message: "El <title> es corto; puedes perder relevancia en SERP.",
    });
  }
  if (len > 65) {
    issues.push({
      id: "title-long",
      severity: "warning",
      category: "metadatos",
      message: "El <title> puede truncarse en Google.",
    });
  }
  const score =
    len >= 45 && len <= 60 ? 95 : len >= 35 && len <= 65 ? 82 : len > 0 ? 65 : 40;
  return { score: clamp(score, 0, 100), issues };
}

function metaScore(
  meta: string | null,
): { score: number; issues: CrawlIssue[] } {
  const issues: CrawlIssue[] = [];
  if (!meta) {
    issues.push({
      id: "meta-missing",
      severity: "error",
      category: "metadatos",
      message: "Falta meta description.",
      fix: "Redacta una descripción de 140–160 caracteres orientada al CTR.",
    });
    return { score: 5, issues };
  }
  const len = meta.length;
  if (len < 120) {
    issues.push({
      id: "meta-short",
      severity: "info",
      category: "metadatos",
      message: "Meta description algo corta para competir en CTR.",
    });
  }
  if (len > 170) {
    issues.push({
      id: "meta-long",
      severity: "warning",
      category: "metadatos",
      message: "Meta description larga; puede cortarse.",
    });
  }
  const score =
    len >= 130 && len <= 160 ? 92 : len >= 100 ? 78 : len > 0 ? 60 : 10;
  return { score: clamp(score, 0, 100), issues };
}

function headingsScore(crawl: ParsedUrlSummary): {
  score: number;
  issues: CrawlIssue[];
} {
  const issues: CrawlIssue[] = [];
  if (crawl.h1.length === 0) {
    issues.push({
      id: "h1-missing",
      severity: "error",
      category: "headings",
      message: "No se detectó H1.",
      fix: "Un único H1 claro que responda a la intención de búsqueda.",
    });
    return { score: 15, issues };
  }
  if (crawl.h1.length > 1) {
    issues.push({
      id: "h1-multiple",
      severity: "warning",
      category: "headings",
      message: "Varios H1 detectados; mejor un H1 y H2 jerárquicos.",
    });
  }
  if (crawl.h2.length === 0) {
    issues.push({
      id: "h2-missing",
      severity: "info",
      category: "headings",
      message: "Pocos o ningún H2; la página puede leerse como un bloque denso.",
    });
  }
  const score =
    crawl.h1.length === 1 && crawl.h2.length >= 3
      ? 95
      : crawl.h1.length === 1
        ? 80
        : 60;
  return { score, issues };
}

function imagesScore(crawl: ParsedUrlSummary): {
  score: number;
  issues: CrawlIssue[];
} {
  const issues: CrawlIssue[] = [];
  const total = crawl.images.length;
  if (total === 0) {
    issues.push({
      id: "images-none",
      severity: "info",
      category: "imágenes",
      message: "No se detectaron imágenes (o están en lazy load no estándar).",
    });
    return { score: 70, issues };
  }
  const missing = crawl.images.filter((i) => i.missingAlt).length;
  const ratio = missing / total;
  if (missing > 0) {
    issues.push({
      id: "alt-missing",
      severity: ratio > 0.5 ? "error" : "warning",
      category: "imágenes",
      message: `${missing} de ${total} imágenes sin alt descriptivo.`,
      fix: "Añade alts con beneficio + contexto sin keyword stuffing.",
    });
  }
  const score = Math.round(100 - ratio * 80);
  return { score: clamp(score, 0, 100), issues };
}

function linkingScore(crawl: ParsedUrlSummary): {
  score: number;
  issues: CrawlIssue[];
} {
  const issues: CrawlIssue[] = [];
  const internal = crawl.linksInternal.length;
  if (internal < 3) {
    issues.push({
      id: "internal-thin",
      severity: "warning",
      category: "enlazado",
      message: "Pocos enlaces internos detectados.",
      fix: "Enlaza a colecciones, fichas relacionadas y guías de compra.",
    });
  }
  const score = clamp(55 + internal * 4, 0, 100);
  return { score, issues };
}

function structureScore(crawl: ParsedUrlSummary): {
  score: number;
  issues: CrawlIssue[];
} {
  const issues: CrawlIssue[] = [];
  if (!crawl.canonical) {
    issues.push({
      id: "canonical-missing",
      severity: "warning",
      category: "estructura",
      message: "Sin canonical explícito.",
      fix: "Define canonical para consolidar señales y evitar duplicados.",
    });
  }
  if (crawl.robots?.toLowerCase().includes("noindex")) {
    issues.push({
      id: "noindex",
      severity: "error",
      category: "estructura",
      message: 'Meta robots contiene "noindex".',
    });
  }
  if (crawl.schemaHints.length === 0) {
    issues.push({
      id: "schema-missing",
      severity: "info",
      category: "estructura",
      message: "No se detectó JSON-LD; valorar Product/FAQ/Breadcrumb.",
    });
  }
  let score = 75;
  if (crawl.canonical) score += 10;
  if (crawl.schemaHints.length) score += 10;
  if (issues.some((i) => i.id === "noindex")) score -= 40;
  return { score: clamp(score, 0, 100), issues };
}

function contentScore(crawl: ParsedUrlSummary): {
  score: number;
  issues: CrawlIssue[];
} {
  const issues: CrawlIssue[] = [];
  const wc = crawl.approximateWordCount;
  if (wc < 200) {
    issues.push({
      id: "content-thin",
      severity: "warning",
      category: "contenido",
      message: "Contenido visible muy breve.",
      fix: "Amplía con FAQs, comparativas y objeciones cubiertas.",
    });
  }
  const score =
    wc > 800 ? 95 : wc > 400 ? 82 : wc > 200 ? 65 : wc > 50 ? 45 : 30;
  return { score: clamp(score, 0, 100), issues };
}

function commerceScore(
  crawl: ParsedUrlSummary,
  pageType: string,
): { score: number; issues: CrawlIssue[] } {
  const issues: CrawlIssue[] = [];
  if (pageType !== "PRODUCT" && pageType !== "COLLECTION") {
    return { score: 80, issues };
  }
  const hasProductSchema = crawl.schemaHints.some((s) =>
    /product/i.test(s.type),
  );
  if (!hasProductSchema) {
    issues.push({
      id: "product-schema",
      severity: "info",
      category: "ecommerce",
      message: "No se detectó schema Product claro.",
      fix: "Añade JSON-LD Product con precio, disponibilidad y reviews si aplica.",
    });
  }
  const hasOg = Boolean(crawl.openGraph["og:image"]);
  if (!hasOg) {
    issues.push({
      id: "og-image",
      severity: "info",
      category: "ecommerce",
      message: "Falta og:image; peor CTR social y algunos rich results.",
    });
  }
  let score = 78;
  if (hasProductSchema) score += 12;
  if (hasOg) score += 10;
  return { score: clamp(score, 0, 100), issues };
}

export function scoreUrlAudit(
  crawl: ParsedUrlSummary,
  pageType: string,
): ScoreResult {
  const t = titleScore(crawl.title);
  const m = metaScore(crawl.metaDescription);
  const metadatos = Math.round((t.score + m.score) / 2);

  const h = headingsScore(crawl);
  const img = imagesScore(crawl);
  const lnk = linkingScore(crawl);
  const st = structureScore(crawl);
  const ct = contentScore(crawl);
  const eco = commerceScore(crawl, pageType);

  const scoresByCategory: ScoresByCategory = {
    metadatos,
    headings: h.score,
    imágenes: img.score,
    enlazado: lnk.score,
    estructura: st.score,
    contenido: ct.score,
    ecommerce: eco.score,
  };

  const vals = Object.values(scoresByCategory);
  const overallScore = Math.round(
    vals.reduce((a, b) => a + b, 0) / vals.length,
  );

  const issues = [
    ...t.issues,
    ...m.issues,
    ...h.issues,
    ...img.issues,
    ...lnk.issues,
    ...st.issues,
    ...ct.issues,
    ...eco.issues,
  ];

  const quickWins: string[] = [];
  if (!crawl.metaDescription)
    quickWins.push("Escribir meta description con promesa + prueba + CTA suave.");
  if (!crawl.canonical)
    quickWins.push("Añadir canonical absoluto a la URL preferente.");
  if (crawl.h1.length === 0) quickWins.push("Definir un H1 que iguale la intención principal.");
  if (crawl.images.some((i) => i.missingAlt))
    quickWins.push("Corregir 3–5 imágenes clave sin alt con descripciones útiles.");
  if (crawl.linksInternal.length < 5)
    quickWins.push("Añadir módulo de productos relacionados con enlaces internos.");

  return {
    overallScore,
    scoresByCategory,
    issues,
    quickWins: [...new Set(quickWins)].slice(0, 8),
  };
}
