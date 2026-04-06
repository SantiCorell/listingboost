"use client";

import Link from "next/link";
import { SeoGapReportBody } from "@/components/seo/seo-gap-report-body";
import { SEO_GAP_LANDING_DEMO } from "@/lib/demo/seo-gap-landing-demo-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

/** Vista previa completa del informe (datos ficticios) para la landing de producto. */
export function SeoGapLandingDemo() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-500/25 bg-[#0c0a12] shadow-2xl shadow-violet-950/50 ring-1 ring-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-tech-grid opacity-[0.35]" />

      <div className="relative border-b border-white/10 bg-gradient-to-r from-violet-950/80 via-fuchsia-950/40 to-transparent px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-amber-400/40 bg-amber-500/15 font-mono text-[10px] uppercase tracking-wider text-amber-100">
              Vista previa interactiva
            </Badge>
            <Badge variant="secondary" className="border-violet-400/30 bg-violet-500/20 text-violet-100">
              Datos de ejemplo
            </Badge>
            <span className="text-xs text-slate-400">
              Keyword demo: <strong className="text-slate-100">zapatillas running mujer</strong>
            </span>
          </div>
          <Button
            asChild
            size="sm"
            className="gap-2 border border-violet-400/40 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-fuchsia-500"
          >
            <Link href="/register">
              <Sparkles className="h-4 w-4" />
              Probar con tu negocio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          Así se ve un informe real: mapas de intención, demanda, ranking de oportunidades, clusters y acciones con URL
          sugerida. Con plan Pro+ generas el tuyo desde Google en tu mercado.
        </p>
      </div>

      <div className="relative p-3 sm:p-5 lg:p-8">
        <SeoGapReportBody
          data={SEO_GAP_LANDING_DEMO}
          toolbar={
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">Informe SEO Gap (demo)</h2>
                <p className="text-xs text-slate-500">Interactivo: ordena por score, volumen o tendencia.</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-100">
                +16 oportunidades priorizadas
              </Badge>
            </div>
          }
        />
      </div>
    </div>
  );
}
