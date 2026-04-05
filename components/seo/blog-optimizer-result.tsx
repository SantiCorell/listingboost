"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BlogOptimizerOutput } from "@/types/blog-optimizer";
import { CopyTextButton } from "@/components/seo/copy-text-button";
import {
  ArrowRight,
  CheckCircle2,
  Link2,
  ListChecks,
  MessageCircleQuestion,
  PenLine,
  Sparkles,
} from "lucide-react";

export function BlogOptimizerResult({ data }: { data: BlogOptimizerOutput }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/90 via-background to-background p-5 shadow-md dark:border-emerald-500/25 dark:from-emerald-950/35">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-400/15 blur-2xl" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h4 className="font-semibold text-foreground">Versión optimizada lista</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Comparativa título e intro; abajo el markdown completo y el checklist de publicación.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border/70 bg-muted/15 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <PenLine className="h-3.5 w-3.5" />
            Título (antes)
          </div>
          <p className="text-sm text-muted-foreground line-through decoration-border">{data.titleBefore}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-emerald-200/50 bg-emerald-50/50 p-4 dark:border-emerald-500/30 dark:bg-emerald-950/25">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-800 dark:text-emerald-200">
            <ArrowRight className="h-3.5 w-3.5" />
            Título (después)
          </div>
          <p className="text-base font-semibold leading-snug text-foreground">{data.titleAfter}</p>
          <CopyTextButton text={data.titleAfter} label="Copiar título" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border/70 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Intro (antes)</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{data.introBefore}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-emerald-200/40 bg-emerald-50/30 p-4 dark:bg-emerald-950/20">
          <p className="text-xs font-semibold uppercase text-emerald-800 dark:text-emerald-200">Intro (después)</p>
          <p className="text-sm leading-relaxed text-foreground">{data.introAfter}</p>
          <CopyTextButton text={data.introAfter} label="Copiar intro" />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-foreground">Checklist antes de publicar</h4>
        </div>
        <ul className="space-y-2">
          {data.checklist.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-border/50 bg-card px-3 py-2.5 text-sm shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="leading-snug text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {data.internalLinkingIdeas.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-foreground">Ideas de enlazado interno</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.internalLinkingIdeas.map((idea, i) => (
              <Badge key={i} variant="secondary" className="max-w-full whitespace-normal font-normal leading-snug">
                {idea}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {data.faqsSuggested.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <MessageCircleQuestion className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-foreground">FAQs sugeridas</h4>
          </div>
          <Accordion type="single" collapsible className="w-full rounded-xl border border-border/60 bg-card">
            {data.faqsSuggested.map((f, i) => (
              <AccordionItem key={i} value={`bfaq-${i}`} className="border-border/60 px-4">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : null}

      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-foreground">Artículo completo (Markdown)</h4>
          </div>
          <CopyTextButton text={data.fullOptimizedMarkdown} label="Copiar markdown" variant="default" />
        </div>
        <div className="max-h-[min(70vh,520px)] overflow-auto rounded-xl border border-border/70 bg-muted/20 p-4 shadow-inner">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
            {data.fullOptimizedMarkdown}
          </pre>
        </div>
      </div>

      <Separator />
      <CopyTextButton
        variant="default"
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
        text={data.fullOptimizedMarkdown}
        label="Copiar artículo entero"
      />
    </div>
  );
}
