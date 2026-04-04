/** Base: crawl HTML + heurísticas + score + issues + quick wins (sin informe IA largo). */
export const CREDIT_URL_AUDIT_BASE = 2;

/** Addon: informe completo con IA (title, meta, FAQs, GSC-style, etc.). */
export const CREDIT_URL_AUDIT_LLM = 1;

/** Addon: inventario de sitemaps del mismo sitio (URLs descubiertas, muestra). */
export const CREDIT_URL_AUDIT_SITEMAP = 2;

/** Exportar informe a PDF multi-página (tras análisis ya guardado). */
export const CREDIT_URL_AUDIT_PDF = 1;

export type UrlAuditModuleOptions = {
  /** Informe IA completo (recomendado para copys y priorización). */
  includeFullLlm: boolean;
  /** Descubrir sitemaps del dominio y contar URLs (mismo origen que la URL). */
  includeSitemap: boolean;
};

export type UrlAuditPreset = "essential" | "standard" | "complete" | "custom";

export function modulesFromPreset(preset: UrlAuditPreset): UrlAuditModuleOptions {
  switch (preset) {
    case "essential":
      return { includeFullLlm: false, includeSitemap: false };
    case "standard":
      return { includeFullLlm: true, includeSitemap: false };
    case "complete":
      return { includeFullLlm: true, includeSitemap: true };
    case "custom":
    default:
      return { includeFullLlm: true, includeSitemap: false };
  }
}

export function totalCreditsForUrlAudit(modules: UrlAuditModuleOptions): number {
  let t = CREDIT_URL_AUDIT_BASE;
  if (modules.includeFullLlm) t += CREDIT_URL_AUDIT_LLM;
  if (modules.includeSitemap) t += CREDIT_URL_AUDIT_SITEMAP;
  return t;
}

export function describeUrlAuditCredits(modules: UrlAuditModuleOptions): string {
  const parts = [`Base (${CREDIT_URL_AUDIT_BASE} cr): crawl + puntuación + issues`];
  if (modules.includeFullLlm) parts.push(`+ IA (${CREDIT_URL_AUDIT_LLM} cr)`);
  if (modules.includeSitemap) parts.push(`+ sitemap (${CREDIT_URL_AUDIT_SITEMAP} cr)`);
  return parts.join(" · ");
}
