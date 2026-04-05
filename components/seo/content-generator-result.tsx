"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ContentGeneratorOutput } from "@/types/content-generator";
import { CopyTextButton } from "@/components/seo/copy-text-button";
import { FileText, Heading1, LayoutList, MessageCircleQuestion, Search } from "lucide-react";

function buildPlainExport(data: ContentGeneratorOutput, keyword: string, type: "blog" | "product"): string {
  const lines: string[] = [
    `Keyword: ${keyword} (${type === "blog" ? "blog" : "producto"})`,
    "",
    `META TITLE\n${data.metaTitle}`,
    "",
    `META DESCRIPTION\n${data.metaDescription}`,
    "",
    `H1\n${data.h1}`,
    "",
  ];
  data.outline.forEach((b, i) => {
    lines.push(`— Sección ${i + 1}: ${b.h2}`, b.body);
    (b.h3 ?? []).forEach((h) => lines.push(`  • ${h}`));
    lines.push("");
  });
  data.faqs.forEach((f) => {
    lines.push(`P: ${f.question}`, `R: ${f.answer}`, "");
  });
  return lines.join("\n");
}

export function ContentGeneratorResult({
  data,
  keyword,
  type,
}: {
  data: ContentGeneratorOutput;
  keyword: string;
  type: "blog" | "product";
}) {
  const jsonLdStr =
    data.jsonLdFaq != null ? JSON.stringify(data.jsonLdFaq, null, 2) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm">
          {type === "blog" ? "Artículo blog" : "Ficha producto"}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Keyword: <strong className="text-foreground">«{keyword}»</strong>
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            Meta title
          </div>
          <p className="text-sm font-medium leading-snug text-foreground">{data.metaTitle}</p>
          <CopyTextButton text={data.metaTitle} label="Copiar title" />
        </div>
        <div className="space-y-2 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            Meta description
          </div>
          <p className="text-sm leading-relaxed text-foreground">{data.metaDescription}</p>
          <CopyTextButton text={data.metaDescription} label="Copiar meta" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/90 via-background to-background p-6 shadow-md dark:border-violet-500/25 dark:from-violet-950/35">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-400/15 blur-2xl" />
        <div className="relative flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-700 dark:text-violet-300">
            <Heading1 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">H1</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">{data.h1}</h3>
            <CopyTextButton text={data.h1} label="Copiar H1" className="mt-3" />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <LayoutList className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-foreground">Estructura y cuerpo</h4>
        </div>
        <div className="space-y-4">
          {data.outline.map((block, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-muted/20 p-4 shadow-sm transition-colors hover:border-primary/25"
            >
              <p className="text-xs font-semibold text-muted-foreground">Sección {i + 1}</p>
              <h5 className="mt-1 text-lg font-semibold text-foreground">{block.h2}</h5>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{block.body}</p>
              {block.h3 && block.h3.length > 0 ? (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-foreground">
                  {block.h3.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {data.faqs.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <MessageCircleQuestion className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-foreground">FAQs</h4>
          </div>
          <Accordion type="single" collapsible className="w-full rounded-xl border border-border/60 bg-card">
            {data.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/60 px-4">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : null}

      {jsonLdStr ? (
        <details className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-4 text-sm">
          <summary className="cursor-pointer font-medium text-foreground">
            <span className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4" />
              JSON-LD FAQ (opcional)
            </span>
          </summary>
          <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-background/80 p-3 text-xs leading-relaxed">
            {jsonLdStr}
          </pre>
          <CopyTextButton text={jsonLdStr} label="Copiar JSON-LD" className="mt-3" />
        </details>
      ) : null}

      <Separator />
      <div className="flex flex-wrap gap-2">
        <CopyTextButton
          variant="default"
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
          text={buildPlainExport(data, keyword, type)}
          label="Copiar todo (texto plano)"
        />
      </div>
    </div>
  );
}
