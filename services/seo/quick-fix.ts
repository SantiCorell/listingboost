import { prisma } from "@/lib/prisma";
import { deepseekChatJson } from "@/services/llm/deepseek";
import { buildQuickFixSystemPrompt, buildQuickFixUserPrompt } from "@/prompts/seo-quick-fix";
import type { CrawlIssue } from "@/types/url-audit";
import { z } from "zod";

const outSchema = z.object({
  optimizedTitle: z.string(),
  optimizedMetaDescription: z.string(),
  optimizedH1: z.string(),
  htmlSnippet: z.string(),
  notes: z.string().optional(),
});

export async function runSeoQuickFix(params: {
  userId: string;
  auditId: string;
  issueId: string;
}): Promise<{ ok: true; output: z.infer<typeof outSchema> } | { ok: false; error: string }> {
  const audit = await prisma.urlAudit.findFirst({
    where: { id: params.auditId, userId: params.userId },
  });
  if (!audit) return { ok: false, error: "Auditoría no encontrada." };

  const output = audit.outputJson as {
    issues?: CrawlIssue[];
    crawl?: unknown;
  };
  const issue = output.issues?.find((i) => i.id === params.issueId);
  if (!issue) return { ok: false, error: "Incidencia no encontrada en el informe." };

  const crawlSummary = audit.crawlSummaryJson ?? output.crawl ?? {};

  const llm = await deepseekChatJson({
    messages: [
      { role: "system", content: buildQuickFixSystemPrompt() },
      {
        role: "user",
        content: buildQuickFixUserPrompt({
          url: audit.url,
          issue: { category: issue.category, message: issue.message, fix: issue.fix },
          crawlSummary,
        }),
      },
    ],
    userId: params.userId,
    operation: "seo_quick_fix",
  });

  if (!llm.ok) return { ok: false, error: llm.error };
  const parsed = outSchema.safeParse(llm.json);
  if (!parsed.success) return { ok: false, error: "Respuesta del modelo inválida." };
  return { ok: true, output: parsed.data };
}
