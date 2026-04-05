import { z } from "zod";
import { seoGapLlmOutputSchema, type SeoGapFinderResult } from "@/types/seo-gap-finder";

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

export function parseSeoGapOutput(raw: unknown): SeoGapFinderResult | null {
  const p = fullSchema.safeParse(raw);
  return p.success ? (p.data as SeoGapFinderResult) : null;
}
