import { z } from "zod";

export const platformContentSchema = z.object({
  title: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  bullets: z.array(z.string()),
  primaryKeywords: z.array(z.string()),
  longTailKeywords: z.array(z.string()),
  recommendedAttributes: z.array(
    z.object({ name: z.string(), value: z.string() }),
  ),
  suggestedCategory: z.string(),
  recommendedTone: z.string(),
  ctrConversionTips: z.array(z.string()),
  priceSuggestion: z
    .object({
      rationale: z.string(),
      suggestedRangeLabel: z.string(),
    })
    .nullable()
    .optional(),
  callToAction: z.string(),
  tags: z.array(z.string()),
  /** Hashtags para IG, TikTok, Shorts (# incluido). Mínimo recomendado en prompt: 8–18. */
  hashtags: z
    .union([z.array(z.string()), z.null(), z.undefined()])
    .transform((v) => (Array.isArray(v) ? v : [])),
  altText: z.string(),
  shopifyExtras: z
    .object({
      metaTitle: z.string(),
      metaDescription: z.string(),
      slug: z.string(),
      faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
      jsonLdProduct: z.record(z.unknown()),
    })
    .optional(),
});

export type PlatformContent = z.infer<typeof platformContentSchema>;

export const productAnalysisOutputSchema = z.object({
  detectedProductType: z.string(),
  targetAudience: z.string(),
  suggestedCategoryGlobal: z.string(),
  platforms: z.object({
    wallapop: platformContentSchema.optional(),
    ebay: platformContentSchema.optional(),
    shopify: platformContentSchema.optional(),
    genericEcommerce: platformContentSchema.optional(),
  }),
});

export type ProductAnalysisOutput = z.infer<typeof productAnalysisOutputSchema>;
