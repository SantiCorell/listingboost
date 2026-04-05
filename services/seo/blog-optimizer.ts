import { deepseekChatJson } from "@/services/llm/deepseek";
import { buildBlogOptimizerSystemPrompt, buildBlogOptimizerUserPrompt } from "@/prompts/blog-optimizer";
import { z } from "zod";

const outSchema = z.object({
  titleBefore: z.string(),
  titleAfter: z.string(),
  introBefore: z.string(),
  introAfter: z.string(),
  fullOptimizedMarkdown: z.string(),
  internalLinkingIdeas: z.array(z.string()),
  faqsSuggested: z.array(z.object({ question: z.string(), answer: z.string() })),
  checklist: z.array(z.string()),
});

export async function runBlogOptimizer(params: {
  userId: string;
  rawText: string;
}): Promise<{ ok: true; output: z.infer<typeof outSchema> } | { ok: false; error: string }> {
  if (params.rawText.trim().length < 80) {
    return { ok: false, error: "El texto es demasiado corto (mín. ~80 caracteres)." };
  }

  const llm = await deepseekChatJson({
    messages: [
      { role: "system", content: buildBlogOptimizerSystemPrompt() },
      { role: "user", content: buildBlogOptimizerUserPrompt(params.rawText) },
    ],
    userId: params.userId,
    operation: "blog_optimize",
  });

  if (!llm.ok) return { ok: false, error: llm.error };
  const parsed = outSchema.safeParse(llm.json);
  if (!parsed.success) return { ok: false, error: "Respuesta del modelo inválida." };
  return { ok: true, output: parsed.data };
}
