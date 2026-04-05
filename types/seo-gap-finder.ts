import { z } from "zod";

export const seoGapDemandTierSchema = z.enum(["alto", "medio", "bajo", "nicho"]);
export type SeoGapDemandTier = z.infer<typeof seoGapDemandTierSchema>;

const volumePreprocess = (val: unknown): number | undefined => {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "number" && Number.isFinite(val)) {
    return Math.round(Math.min(Math.max(val, 0), 10_000_000));
  }
  if (typeof val === "string") {
    const cleaned = val.replace(/\s/g, "").replace(/\./g, "");
    const n = Number.parseInt(cleaned, 10);
    if (Number.isFinite(n)) return Math.min(Math.max(n, 0), 10_000_000);
  }
  return undefined;
};

const seoGapOpportunityInputSchema = z.object({
  keyword: z.string(),
  type: z.enum(["informacional", "transaccional", "navegacional"]),
  cluster: z.string(),
  score: z.number(),
  opportunityLevel: z.enum(["alta", "media", "baja"]),
  action: z.string(),
  title: z.string(),
  url: z.string(),
  /** Estimación de volumen / long-tail (inferida por el modelo desde la SERP). */
  demandTier: seoGapDemandTierSchema.optional(),
  /**
   * Estimación de búsquedas mensuales en Google (mercado del informe). Orientativa (IA + SERP).
   */
  monthlyVolumeEstimate: z.preprocess(volumePreprocess, z.number().int().optional()),
  /** Interés relativo Google Trends 0–100 (último periodo); lo rellena el servidor con SerpAPI. */
  trendsInterest: z.number().int().min(0).max(100).optional(),
});

export const seoGapOpportunitySchema = seoGapOpportunityInputSchema.transform((o) => ({
  ...o,
  demandTier: o.demandTier ?? ("medio" as SeoGapDemandTier),
  monthlyVolumeEstimate: o.monthlyVolumeEstimate ?? null,
  trendsInterest: o.trendsInterest ?? null,
}));

export const seoGapLlmOutputSchema = z.object({
  executiveSummary: z.string(),
  opportunities: z.array(seoGapOpportunitySchema),
});

export type SeoGapOpportunity = z.infer<typeof seoGapOpportunitySchema>;
export type SeoGapLlmOutput = z.infer<typeof seoGapLlmOutputSchema>;

export type SeoGapFinderMeta = {
  keyword: string;
  domain: string | null;
  country: string;
  language: string;
  organicCount: number;
  competitorsCrawled: number;
  crawlWarnings: string[];
  serpError?: string;
  userSiteKeywordsSample?: string[];
  generatedAt: string;
  /** Cuántas keywords recibieron dato de Google Trends (SerpAPI). */
  trendsDataPoints?: number;
};

export type SeoGapFinderResult = SeoGapLlmOutput & { meta: SeoGapFinderMeta };

export function isLongTailGem(o: SeoGapOpportunity): boolean {
  return o.demandTier === "bajo" || o.demandTier === "nicho";
}
