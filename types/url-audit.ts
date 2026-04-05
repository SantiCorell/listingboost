import { z } from "zod";

/** Estimaciones estilo Search Console (no son datos reales de GSC; el modelo debe decirlo). */
export const urlAuditGscStyleSchema = z.object({
  disclaimer: z.string().optional(),
  healthVsSimilarPagesPercent: z.number().min(0).max(100).optional(),
  ctrHeadroomPercent: z.number().min(0).max(100).optional(),
  impressionPotential: z.enum(["baja", "media", "alta"]).optional(),
  positionBandGuess: z.string().optional(),
  queriesToTarget: z.array(z.string()).optional(),
  technicalNotes: z.string().optional(),
});

export const urlAuditLlmSchema = z.object({
  summary: z.string(),
  mainKeywordInference: z.string(),
  searchIntent: z.string(),
  recommendedTitle: z.string(),
  recommendedMetaDescription: z.string(),
  recommendedH1: z.string(),
  suggestedHeadings: z.object({
    h2: z.array(z.string()),
    h3ByH2: z.record(z.array(z.string())).optional(),
  }),
  suggestedKeywords: z.array(z.string()),
  secondaryKeywords: z.array(z.string()),
  suggestedFaqs: z.array(
    z.object({ question: z.string(), answer: z.string() }),
  ),
  contentGaps: z.array(z.string()),
  conversionSuggestions: z.array(z.string()),
  prioritizedActions: z.array(z.string()),
  interlinkingIdeas: z.array(z.string()),
  /** Plan de consultoría: qué está mal, qué sustituir y cómo implementarlo (PDF + UI). */
  detailedRecommendations: z
    .array(
      z.object({
        title: z.string(),
        problem: z.string().optional(),
        proposedChange: z.string(),
        howToImplement: z.string(),
      }),
    )
    .optional(),
  gscStyle: urlAuditGscStyleSchema.optional(),
});

export type UrlAuditLlmOutput = z.infer<typeof urlAuditLlmSchema>;

export const scoresByCategorySchema = z.record(z.number());

export type ScoresByCategory = z.infer<typeof scoresByCategorySchema>;

export type CrawlIssueSeverity = "error" | "warning" | "info";

export type CrawlIssue = {
  id: string;
  severity: CrawlIssueSeverity;
  category: string;
  message: string;
  fix?: string;
};
