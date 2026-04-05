import { z } from "zod";

export const seoGapOpportunitySchema = z.object({
  keyword: z.string(),
  type: z.enum(["informacional", "transaccional", "navegacional"]),
  cluster: z.string(),
  score: z.number(),
  opportunityLevel: z.enum(["alta", "media", "baja"]),
  action: z.string(),
  title: z.string(),
  url: z.string(),
});

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
