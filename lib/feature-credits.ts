/**
 * Costes en unidades de cupo / créditos por feature (ajustar con margen vs API).
 * Ver también CREDIT_COST_* en lib/usage.ts para flujos legacy.
 */
export const FEATURE_CREDITS = {
  /** Arreglo 1‑clic (title/meta/H1) desde un issue concreto. */
  SEO_QUICK_FIX: 2,
  /** Generador SEO (Contenido): artículo o ficha por keyword — mismo coste blog/producto. */
  SEO_CONTENT_BLOG: 1,
  SEO_CONTENT_PRODUCT: 1,
  /** Pestaña Blog: optimización de borrador existente. */
  BLOG_OPTIMIZE: 4,
  /** Dos URLs comparadas. */
  COMPETITOR_COMPARE: 5,
  /** Export PDF comparativa (Free y Pro: 1 cr; Pro+ / Enterprise: 0 en cobro). */
  COMPETITOR_PDF_EXPORT: 1,
  /**
   * Informe SERP premium: quién está por encima, por qué pueden rankear mejor y plan por fases
   * (crawl + SerpAPI + LLM). Mayor coste que una comparativa manual entre dos URLs.
   */
  SERP_COMPETITOR_INSIGHT: 8,
  /** Export PDF informe SERP premium ya guardado (misma lógica que auditoría URL). */
  SERP_INSIGHT_PDF_EXPORT: 1,
} as const;
