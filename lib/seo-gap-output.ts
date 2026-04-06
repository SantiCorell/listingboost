import { z } from "zod";
import {
  seoGapLlmOutputSchema,
  type SeoGapDemandTier,
  type SeoGapFinderMeta,
  type SeoGapFinderResult,
  type SeoGapOpportunity,
} from "@/types/seo-gap-finder";

const metaSchema = z.object({
  keyword: z.string(),
  domain: z.string().nullable(),
  country: z.string(),
  language: z.string(),
  organicCount: z.number(),
  competitorsCrawled: z.number(),
  crawlWarnings: z.array(z.string()),
  userSiteKeywordsSample: z.array(z.string()).optional(),
  serpError: z.string().optional(),
  generatedAt: z.string(),
  trendsDataPoints: z.number().optional(),
});

const fullSchema = seoGapLlmOutputSchema.extend({ meta: metaSchema });

export type SeoGapReportRowForParse = {
  keyword: string;
  domain: string | null;
  country: string;
  language: string;
};

/** Algunas bases / drivers devuelven JSON como string; Prisma suele ya parsearlo. */
function unwrapJsonPayload(raw: unknown): unknown {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return raw;
    }
  }
  return raw;
}

export function parseSeoGapOutput(raw: unknown): SeoGapFinderResult | null {
  const p = fullSchema.safeParse(unwrapJsonPayload(raw));
  return p.success ? (p.data as SeoGapFinderResult) : null;
}

function coerceFiniteNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
    const n = Number.parseFloat(cleaned);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function normalizeIntent(
  v: unknown,
): "informacional" | "transaccional" | "navegacional" {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  const map: Record<string, "informacional" | "transaccional" | "navegacional"> = {
    informacional: "informacional",
    informational: "informacional",
    info: "informacional",
    transaccional: "transaccional",
    transactional: "transaccional",
    trans: "transaccional",
    navegacional: "navegacional",
    navigational: "navegacional",
    nav: "navegacional",
  };
  return map[s] ?? "informacional";
}

function normalizeOppLevel(v: unknown): "alta" | "media" | "baja" {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  if (s === "alta" || s === "high" || s === "alto") return "alta";
  if (s === "baja" || s === "low" || s === "bajo") return "baja";
  return "media";
}

function normalizeDemandTier(v: unknown): SeoGapDemandTier {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  if (s === "alto" || s === "medio" || s === "bajo" || s === "nicho") return s;
  return "medio";
}

function stringField(v: unknown, fallback: string): string {
  if (typeof v === "string" && v.trim()) return v.trim();
  return fallback;
}

function normalizeOpportunityLoose(item: unknown): SeoGapOpportunity | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  const keyword = stringField(o.keyword, "");
  if (!keyword) return null;

  let score = coerceFiniteNumber(o.score);
  if (score === undefined) score = 0;
  score = Math.round(Math.min(100, Math.max(0, score)));

  const mv = coerceFiniteNumber(o.monthlyVolumeEstimate);
  const ti = coerceFiniteNumber(o.trendsInterest);
  const trendsInterest =
    ti !== undefined ? Math.round(Math.min(100, Math.max(0, ti))) : null;

  return {
    keyword,
    type: normalizeIntent(o.type),
    cluster: stringField(o.cluster, "General"),
    score,
    opportunityLevel: normalizeOppLevel(o.opportunityLevel),
    action: stringField(o.action, "—"),
    title: stringField(o.title, keyword),
    url: stringField(o.url, "#"),
    demandTier: normalizeDemandTier(o.demandTier),
    monthlyVolumeEstimate: mv !== undefined ? Math.round(Math.min(10_000_000, Math.max(0, mv))) : null,
    trendsInterest,
  };
}

function stringArrayLoose(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x): x is string => typeof x === "string" && x.length > 0);
  return out.length ? out : undefined;
}

function buildMetaLoose(
  raw: Record<string, unknown>,
  row: SeoGapReportRowForParse,
): SeoGapFinderMeta {
  const m =
    raw.meta && typeof raw.meta === "object" && raw.meta !== null
      ? (raw.meta as Record<string, unknown>)
      : {};

  const organicCount = coerceFiniteNumber(m.organicCount) ?? 0;
  const competitorsCrawled = coerceFiniteNumber(m.competitorsCrawled) ?? 0;
  const crawlWarnings = Array.isArray(m.crawlWarnings)
    ? m.crawlWarnings.filter((x): x is string => typeof x === "string")
    : [];

  return {
    keyword: row.keyword,
    domain: row.domain,
    country: row.country,
    language: row.language,
    organicCount: Math.max(0, Math.round(organicCount)),
    competitorsCrawled: Math.max(0, Math.round(competitorsCrawled)),
    crawlWarnings,
    userSiteKeywordsSample: stringArrayLoose(m.userSiteKeywordsSample),
    serpError: typeof m.serpError === "string" ? m.serpError : undefined,
    generatedAt:
      typeof m.generatedAt === "string" && m.generatedAt.trim()
        ? m.generatedAt.trim()
        : new Date(0).toISOString(),
    trendsDataPoints:
      coerceFiniteNumber(m.trendsDataPoints) !== undefined
        ? Math.max(0, Math.round(coerceFiniteNumber(m.trendsDataPoints)!))
        : undefined,
  };
}

/**
 * Parseo estricto primero; si falla (esquemas viejos, tipos sueltos del JSON en BD),
 * reconstruye un resultado válido usando las columnas del informe para `meta`.
 */
export function parseSeoGapOutputForStoredReport(
  raw: unknown,
  row: SeoGapReportRowForParse,
): SeoGapFinderResult | null {
  const unwrapped = unwrapJsonPayload(raw);
  const strict = parseSeoGapOutput(unwrapped);
  if (strict) return strict;

  if (!unwrapped || typeof unwrapped !== "object") return null;
  const obj = unwrapped as Record<string, unknown>;

  const execRaw = obj.executiveSummary;
  const executiveSummary =
    typeof execRaw === "string" && execRaw.trim()
      ? execRaw.trim()
      : "Informe recuperado. El resumen ejecutivo no estaba en el formato esperado; revisa las oportunidades abajo.";

  const opRaw = obj.opportunities;
  const list = Array.isArray(opRaw) ? opRaw : [];
  const opportunities = list
    .map(normalizeOpportunityLoose)
    .filter((o): o is SeoGapOpportunity => o !== null);

  if (opportunities.length === 0) return null;

  const meta = buildMetaLoose(obj, row);

  return {
    executiveSummary,
    opportunities,
    meta,
  };
}
