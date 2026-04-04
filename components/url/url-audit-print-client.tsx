"use client";

import type { CrawlIssue, UrlAuditLlmOutput } from "@/types/url-audit";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

type AuditOutput = {
  scores: { overallScore: number; byCategory: Record<string, number> };
  issues: CrawlIssue[];
  quickWins: string[];
  llm: UrlAuditLlmOutput;
};

export function UrlAuditPrintClient({
  url,
  createdAt,
  pageType,
  output,
}: {
  url: string;
  createdAt: string;
  pageType: string;
  output: unknown;
}) {
  const data = output as AuditOutput;
  const { llm, scores, issues, quickWins } = data;
  const gsc = llm.gscStyle;

  return (
    <>
      <div className="print:hidden sticky top-0 z-10 flex justify-end border-b bg-white/95 p-3 backdrop-blur">
        <Button type="button" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir o guardar como PDF
        </Button>
      </div>

      <article className="mx-auto max-w-3xl space-y-8 p-6 text-sm leading-relaxed print:max-w-none print:p-0">
        <header className="space-y-2 border-b border-neutral-300 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            ListingBoost · Informe de auditoría SEO
          </p>
          <h1 className="text-2xl font-bold text-neutral-900">Scan URL</h1>
          <p className="break-all text-neutral-700">{url}</p>
          <p className="text-xs text-neutral-500">
            {new Date(createdAt).toLocaleString("es-ES")} · Tipo: {pageType}
          </p>
        </header>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Resumen</h2>
          <p className="whitespace-pre-wrap text-neutral-800">{llm.summary}</p>
          <p className="mt-2 text-xs text-neutral-600">
            Keyword inferida: <strong>{llm.mainKeywordInference}</strong> · Intención: {llm.searchIntent}
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">Puntuación on-page (heurística)</p>
            <p className="text-4xl font-bold tabular-nums">{scores.overallScore}</p>
            <p className="text-xs text-neutral-500">de 100</p>
          </div>
          {gsc ? (
            <div className="rounded-lg border border-neutral-200 p-4 space-y-1">
              <p className="text-xs font-semibold text-neutral-600">Vista estilo rendimiento (estimado)</p>
              {gsc.disclaimer ? (
                <p className="text-[11px] text-neutral-500">{gsc.disclaimer}</p>
              ) : null}
              {gsc.healthVsSimilarPagesPercent != null ? (
                <p className="text-xs">
                  Salud vs páginas similares:{" "}
                  <strong>{gsc.healthVsSimilarPagesPercent}%</strong>
                </p>
              ) : null}
              {gsc.ctrHeadroomPercent != null ? (
                <p className="text-xs">
                  Margen CTR estimado: <strong>{gsc.ctrHeadroomPercent}%</strong>
                </p>
              ) : null}
              {gsc.impressionPotential ? (
                <p className="text-xs">
                  Potencial impresiones: <strong>{gsc.impressionPotential}</strong>
                </p>
              ) : null}
              {gsc.positionBandGuess ? (
                <p className="text-xs">Banda posición estimada: {gsc.positionBandGuess}</p>
              ) : null}
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Scores por categoría</h2>
          <table className="w-full border-collapse text-xs">
            <tbody>
              {Object.entries(scores.byCategory).map(([k, v]) => (
                <tr key={k} className="border-b border-neutral-200">
                  <td className="py-1.5 capitalize text-neutral-700">{k}</td>
                  <td className="py-1.5 text-right font-semibold tabular-nums">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {gsc?.queriesToTarget?.length ? (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Consultas sugeridas a trabajar</h2>
            <ul className="list-inside list-disc space-y-1 text-neutral-800">
              {gsc.queriesToTarget.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-2 text-lg font-semibold">Problemas detectados</h2>
          <ul className="space-y-2">
            {issues.slice(0, 20).map((i) => (
              <li key={i.id} className="border-b border-neutral-100 pb-2 text-neutral-800">
                <span className="text-[10px] font-semibold uppercase text-neutral-500">
                  {i.severity}
                </span>{" "}
                {i.category}: {i.message}
                {i.fix ? <span className="block text-xs text-neutral-600">Fix: {i.fix}</span> : null}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Quick wins</h2>
          <ul className="list-inside list-disc space-y-1">
            {quickWins.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Acciones priorizadas</h2>
          <ol className="list-decimal space-y-2 pl-5">
            {llm.prioritizedActions.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Propuestas on-page</h2>
          <div>
            <p className="text-xs font-medium text-neutral-500">Title</p>
            <p className="whitespace-pre-wrap">{llm.recommendedTitle}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">Meta description</p>
            <p className="whitespace-pre-wrap">{llm.recommendedMetaDescription}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">H1</p>
            <p className="whitespace-pre-wrap">{llm.recommendedH1}</p>
          </div>
        </section>

        <footer className="border-t border-neutral-300 pt-4 text-[10px] text-neutral-500">
          Informe generado por ListingBoost. Los scores son heurísticos; las métricas tipo Search Console son
          estimaciones del modelo, no datos de Google.
        </footer>
      </article>
    </>
  );
}
