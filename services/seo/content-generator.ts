import { deepseekChatJson } from "@/services/llm/deepseek";
import {
  buildContentGeneratorSystemPrompt,
  buildContentGeneratorUserPrompt,
} from "@/prompts/content-generator";
import { z } from "zod";

const outSchema = z.object({
  h1: z.string(),
  outline: z.array(
    z.object({
      h2: z.string(),
      body: z.string(),
      h3: z.array(z.string()).optional(),
    }),
  ),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  jsonLdFaq: z.unknown().optional(),
  metaTitle: z.string(),
  metaDescription: z.string(),
});

export async function runContentGenerator(params: {
  userId: string;
  keyword: string;
  type: "blog" | "product";
  country?: string;
}): Promise<{ ok: true; output: z.infer<typeof outSchema> } | { ok: false; error: string }> {
  const llm = await deepseekChatJson({
    messages: [
      { role: "system", content: buildContentGeneratorSystemPrompt() },
      {
        role: "user",
        content: buildContentGeneratorUserPrompt({
          keyword: params.keyword,
          type: params.type,
          country: params.country,
        }),
      },
    ],
    userId: params.userId,
    operation: "seo_content",
  });

  if (!llm.ok) return { ok: false, error: llm.error };
  const parsed = outSchema.safeParse(llm.json);
  if (!parsed.success) return { ok: false, error: "Respuesta del modelo inválida." };
  return { ok: true, output: parsed.data };
}
