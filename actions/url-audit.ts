"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { discoverSitemapReport } from "@/lib/sitemap/discover";
import { scoreUrlAudit } from "@/lib/seo/score-url";
import { assertCanAnalyze, recordAnalysisUsage } from "@/lib/usage";
import {
  modulesFromPreset,
  totalCreditsForUrlAudit,
  type UrlAuditModuleOptions,
} from "@/lib/url-audit/credits-config";
import {
  buildUrlAuditSystemPrompt,
  buildUrlAuditUserPrompt,
} from "@/prompts/url-audit";
import { deepseekChatJson } from "@/services/llm/deepseek";
import { fetchAndParseUrl } from "@/services/url/crawler";
import { urlAuditLlmSchema } from "@/types/url-audit";
import { UrlPageType } from "@prisma/client";
import { z } from "zod";

const inputSchema = z.object({
  url: z.string().url(),
  country: z.string().min(2).max(80),
  keywordHint: z.string().max(200).optional(),
  pageType: z.nativeEnum(UrlPageType),
  preset: z.enum(["essential", "standard", "complete", "custom"]),
  includeFullLlm: z.boolean().optional(),
  includeSitemap: z.boolean().optional(),
});

function resolveModules(
  data: z.infer<typeof inputSchema>,
): UrlAuditModuleOptions {
  if (data.preset !== "custom") {
    return modulesFromPreset(data.preset);
  }
  return {
    includeFullLlm: data.includeFullLlm ?? true,
    includeSitemap: data.includeSitemap ?? false,
  };
}

export type UrlAuditActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "success";
      auditId: string;
      output: unknown;
      creditsCharged: number;
      modules: UrlAuditModuleOptions;
    };

export async function runUrlAudit(
  payload: z.infer<typeof inputSchema>,
): Promise<UrlAuditActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "error", message: "Debes iniciar sesión." };
  }

  const parsed = inputSchema.safeParse(payload);
  if (!parsed.success) {
    return { status: "error", message: "URL o parámetros inválidos." };
  }

  const modules = resolveModules(parsed.data);
  const creditsNeeded = totalCreditsForUrlAudit(modules);

  try {
    await assertCanAnalyze(session.user.id, creditsNeeded);
  } catch (e) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "Límite alcanzado",
    };
  }

  let crawl;
  try {
    crawl = await fetchAndParseUrl(parsed.data.url);
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof Error
          ? `No se pudo obtener la URL: ${e.message}`
          : "No se pudo obtener la URL.",
    };
  }

  const pageType = parsed.data.pageType;
  const heuristic = scoreUrlAudit(crawl, pageType);

  let sitemapReport: Awaited<ReturnType<typeof discoverSitemapReport>> | null = null;
  if (modules.includeSitemap) {
    try {
      sitemapReport = await discoverSitemapReport(parsed.data.url);
    } catch (e) {
      sitemapReport = {
        seedUrl: parsed.data.url,
        origin: "",
        sitemapSourcesTried: [],
        sitemapXmlUrls: [],
        totalUrls: 0,
        urlSample: [],
        truncated: false,
        errors: [e instanceof Error ? e.message : "Error al analizar sitemaps"],
      };
    }
  }

  const crawlSummary = {
    finalUrl: crawl.finalUrl,
    statusCode: crawl.statusCode,
    title: crawl.title,
    metaDescription: crawl.metaDescription,
    canonical: crawl.canonical,
    robots: crawl.robots,
    openGraphKeys: Object.keys(crawl.openGraph),
    twitterKeys: Object.keys(crawl.twitter),
    h1: crawl.h1,
    h2Headings: crawl.h2.slice(0, 30),
    h3Headings: crawl.h3.slice(0, 30),
    approximateWordCount: crawl.approximateWordCount,
    imageCount: crawl.images.length,
    imagesMissingAlt: crawl.images.filter((i) => i.missingAlt).length,
    internalLinksSample: crawl.linksInternal.slice(0, 25),
    externalLinksCount: crawl.linksExternal.length,
    schemaDetected: crawl.schemaHints.map((s) => s.type),
    textSample: crawl.mainTextSample.slice(0, 6000),
    sitemapReport,
  };

  let llmParsed: z.infer<typeof urlAuditLlmSchema> | null = null;

  if (modules.includeFullLlm) {
    const userPrompt = buildUrlAuditUserPrompt({
      url: parsed.data.url,
      country: parsed.data.country,
      keywordHint: parsed.data.keywordHint,
      pageType,
      crawlSummary,
      heuristic: {
        overallScore: heuristic.overallScore,
        scoresByCategory: heuristic.scoresByCategory,
        issues: heuristic.issues,
        quickWins: heuristic.quickWins,
      },
    });

    const llm = await deepseekChatJson({
      messages: [
        { role: "system", content: buildUrlAuditSystemPrompt() },
        { role: "user", content: userPrompt },
      ],
      userId: session.user.id,
      operation: "url_audit",
    });

    if (!llm.ok) {
      return { status: "error", message: llm.error };
    }

    const validated = urlAuditLlmSchema.safeParse(llm.json);
    if (!validated.success) {
      return {
        status: "error",
        message: "La respuesta del modelo no tenía el formato esperado.",
      };
    }
    llmParsed = validated.data;
  }

  const output = {
    modules: {
      preset: parsed.data.preset,
      includeFullLlm: modules.includeFullLlm,
      includeSitemap: modules.includeSitemap,
      creditsCharged: creditsNeeded,
    },
    sitemapReport,
    crawl,
    scores: {
      overallScore: heuristic.overallScore,
      byCategory: heuristic.scoresByCategory,
    },
    issues: heuristic.issues,
    quickWins: heuristic.quickWins,
    llm: llmParsed,
  };

  const row = await prisma.urlAudit.create({
    data: {
      userId: session.user.id,
      url: parsed.data.url,
      country: parsed.data.country,
      keywordHint: parsed.data.keywordHint ?? null,
      pageType,
      crawlSummaryJson: crawlSummary as object,
      outputJson: output as object,
    },
  });

  await recordAnalysisUsage(session.user.id, "url_audit", creditsNeeded);

  return {
    status: "success",
    auditId: row.id,
    output,
    creditsCharged: creditsNeeded,
    modules,
  };
}
