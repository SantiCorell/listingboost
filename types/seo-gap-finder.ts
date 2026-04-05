import { z } from "zod";

export const seoGapDemandTierSchema = z.enum(["alto", "medio", "bajo", "nicho"]);
export type SeoGapDemandTier = z.infer<typeof seoGapDemandTierSchema>;

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
});

export const seoGapOpportunitySchema = seoGapOpportunityInputSchema.transform((o) => ({
  ...o,
  demandTier: o.demandTier ?? ("medio" as SeoGapDemandTier),
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
};

export type SeoGapFinderResult = SeoGapLlmOutput & { meta: SeoGapFinderMeta };

export function isLongTailGem(o: SeoGapOpportunity): boolean {
  return o.demandTier === "bajo" || o.demandTier === "nicho";
}
