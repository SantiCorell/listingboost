import { prisma } from "@/lib/prisma";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import {
  buildProductSeoSystemPrompt,
  buildProductSeoUserPrompt,
} from "@/prompts/product-seo";
import { deepseekChatJsonWithVisionFallback } from "@/services/llm/deepseek";
import { enrichProductOutputWithHashtags } from "@/lib/product-hashtags";
import { productAnalysisOutputSchema } from "@/types/product-analysis";
import { ProductPlatformTarget } from "@prisma/client";
import { z } from "zod";

export const productSeoInputSchema = z.object({
  description: z.string().max(20_000).optional(),
  imageUrl: z.string().url().nullable().optional(),
  platformTarget: z.nativeEnum(ProductPlatformTarget),
  language: z.string().min(2).max(12),
  country: z.string().min(2).max(80),
  categoryHint: z.string().max(200).optional(),
  tone: z.enum(["profesional", "vendedor", "premium", "cercano"]),
});

export type ProductSeoInput = z.infer<typeof productSeoInputSchema>;

export type ProductSeoExecResult =
  | { ok: true; analysisId: string; output: unknown }
  | { ok: false; message: string };

export async function executeProductSeoForUser(
  userId: string,
  data: ProductSeoInput,
): Promise<ProductSeoExecResult> {
  if (!data.description?.trim() && !data.imageUrl) {
    return {
      ok: false,
      message: "Añade texto o una imagen para analizar el producto.",
    };
  }

  try {
    await assertCanAnalyze(userId);
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Límite alcanzado",
    };
  }

  const system = buildProductSeoSystemPrompt();
  const userPrompt = buildProductSeoUserPrompt({
    description: data.description?.trim() ?? "",
    imageContext: data.imageUrl
      ? `Hay imagen de producto disponible en: ${data.imageUrl}`
      : "No hay imagen; usa solo el texto.",
    platformTarget:
      data.platformTarget === ProductPlatformTarget.ALL ? "ALL" : data.platformTarget,
    language: data.language,
    country: data.country,
    categoryHint: data.categoryHint,
    tone: data.tone,
  });

  const llm = await deepseekChatJsonWithVisionFallback({
    system,
    userText: userPrompt,
    imageUrl: data.imageUrl ?? null,
    userId,
    operation: "product_seo",
  });

  if (!llm.ok) {
    return { ok: false, message: llm.error };
  }

  const validated = productAnalysisOutputSchema.safeParse(llm.json);
  if (!validated.success) {
    return {
      ok: false,
      message: "La respuesta del modelo no tenía el formato esperado.",
    };
  }

  const output = enrichProductOutputWithHashtags(validated.data);

  const row = await prisma.productAnalysis.create({
    data: {
      userId,
      descriptionInput: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      platformTarget: data.platformTarget,
      language: data.language,
      country: data.country,
      categoryHint: data.categoryHint ?? null,
      tone: data.tone,
      outputJson: output as object,
    },
  });

  await recordAnalysisUsage(userId, "product_seo");

  return {
    ok: true,
    analysisId: row.id,
    output,
  };
}
