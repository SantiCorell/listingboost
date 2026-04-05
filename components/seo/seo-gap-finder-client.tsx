"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SeoGapIntentChart, SeoGapLevelChart, SeoGapScoreBars } from "@/components/seo/seo-gap-charts";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import type { SeoGapFinderResult } from "@/types/seo-gap-finder";
import { Loader2, Sparkles, ArrowRight, Coins, Zap } from "lucide-react";

const LEVEL_BADGE: Record<string, string> = {
  alta: "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
  media: "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100",
  baja: "border-border bg-muted/50 text-muted-foreground",
};

export function SeoGapFinderClient() {
  const [keyword, setKeyword] = useState("");
  const [domain, setDomain] = useState("");
  const [country, setCountry] = useState("es");
  const [language, setLanguage] = useState("es");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<SeoGapFinderResult | null>(null);
  const [cached, setCached] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState<number | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  async function run() {
    setErr(null);
    setResult(null);
    setLoading(true);
    try {
      const r = await fetch("/api/seo-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword.trim(),
          domain: domain.trim() || undefined,
          country,
          language,
        }),
      });
      const raw = await r.text();
      let j: {
        ok?: boolean;
        error?: string;
        output?: SeoGapFinderResult;
        creditsUsed?: number;
        cached?: boolean;
        reportId?: string;
      } = {};
      try {
        j = raw ? (JSON.parse(raw) as typeof j) : {};
      } catch {
        setErr(
          r.ok
            ? "Respuesta del servidor no válida."
            : `Error del servidor (${r.status}). Prueba de nuevo o revisa la consola del dev server.`,
        );
        return;
      }
      if (!r.ok) {
        setErr(j.error ?? `Error ${r.status}`);
        return;
      }
      if (j.output) {
        setResult(j.output);
        setCached(Boolean(j.cached));
        setCreditsUsed(typeof j.creditsUsed === "number" ? j.creditsUsed : null);
        setReportId(j.reportId ?? null);
      }
    } catch {
      setErr("No se pudo conectar. Comprueba tu red o que el servidor esté en marcha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Accordion type="single" collapsible className="rounded-xl border border-primary/20 bg-primary/[0.04]">
        <AccordionItem value="how" className="border-none px-4">
          <AccordionTrigger className="py-4 text-left hover:no-underline">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Zap className="h-4 w-4 text-primary" />
              Cómo funciona SEO Gap Finder AI
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
            <ol className="list-inside list-decimal space-y-2">
              <li>
                Consultamos <strong className="text-foreground">Google en vivo</strong> (SerpAPI) con tu keyword,
                país e idioma: top orgánicos, búsquedas relacionadas y People Also Ask.
              </li>
              <li>
                <strong className="text-foreground">Rastreamos hasta 7 URLs</strong> de la SERP: H1, H2, meta y
                términos frecuentes para ver qué está funcionando.
              </li>
              <li>
                Si indicas <strong className="text-foreground">dominio propio</strong>, analizamos tu home y
                contrastamos huecos frente a la competencia.
              </li>
              <li>
                <strong className="text-foreground">ListingBrain</strong> agrupa intenciones, prioriza con score y
                convierte cada fila en <strong className="text-foreground">acción + título + URL sugerida</strong>.
              </li>
              <li>
                Cuesta <strong className="text-foreground">{FEATURE_CREDITS.SEO_GAP_FINDER} créditos</strong> por
                informe nuevo; la misma consulta en 24 h puede servirse desde caché sin cobrar.
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Encontrar oportunidades SEO
          </CardTitle>
          <CardDescription>
            Introduce la keyword que quieres conquistar en Google. Opcionalmente tu dominio para ver gaps frente a la
            SERP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="gap-kw">Keyword principal *</Label>
              <Input
                id="gap-kw"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ej. software facturación autónomos"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="gap-domain">Tu dominio (opcional)</Label>
              <Input
                id="gap-domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="mitienda.com"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="gap-gl">País (gl)</Label>
              <Input
                id="gap-gl"
                value={country}
                onChange={(e) => setCountry(e.target.value.toLowerCase().slice(0, 2))}
                placeholder="es"
                className="mt-1.5 font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="gap-hl">Idioma (hl)</Label>
              <Input
                id="gap-hl"
                value={language}
                onChange={(e) => setLanguage(e.target.value.toLowerCase().slice(0, 5))}
                placeholder="es"
                className="mt-1.5 font-mono text-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="lg"
              disabled={loading || !keyword.trim()}
              className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 shadow-md"
              onClick={() => void run()}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Analizar gap ({FEATURE_CREDITS.SEO_GAP_FINDER} cr)
            </Button>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="h-3.5 w-3.5" />
              Pro+ y Enterprise · caché 24 h
            </span>
          </div>
          {err ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {err}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Informe</h2>
            <div className="flex flex-wrap gap-2">
              {cached ? (
                <Badge variant="secondary">Desde caché (0 cr)</Badge>
              ) : (
                <Badge variant="secondary">
                  {creditsUsed === 0 ? "Sin cargo de cupo" : `−${creditsUsed} cr`}
                </Badge>
              )}
              {reportId ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/seo-gap/${reportId}`}>Abrir URL del informe</Link>
                </Button>
              ) : null}
            </div>
          </div>

          <Card className="border-violet-200/50 bg-violet-500/[0.04] dark:border-violet-500/20 dark:bg-violet-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resumen ejecutivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {result.executiveSummary}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <SeoGapIntentChart opportunities={result.opportunities} />
            <SeoGapLevelChart opportunities={result.opportunities} />
            <div className="lg:col-span-1">
              <SeoGapScoreBars opportunities={result.opportunities} />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Oportunidades priorizadas</CardTitle>
              <CardDescription>
                Ordenadas por score. Cada fila es una acción concreta, no solo una métrica.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.opportunities.map((o, i) => (
                <div
                  key={`${o.keyword}-${i}`}
                  className="rounded-xl border border-border/70 bg-muted/10 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{o.keyword}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {o.cluster} · <span className="capitalize">{o.type}</span> · score {o.score}
                      </p>
                    </div>
                    <Badge className={LEVEL_BADGE[o.opportunityLevel] ?? ""}>{o.opportunityLevel}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{o.action}</p>
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">Título sugerido:</span>{" "}
                    <strong className="text-foreground">{o.title}</strong>
                  </p>
                  <p className="mt-1 font-mono text-xs text-primary">{o.url}</p>
                  <Button asChild size="sm" className="mt-3 gap-1">
                    <Link
                      href={`/dashboard/seo-engine?tab=content&kw=${encodeURIComponent(o.keyword)}`}
                    >
                      Generar página
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {result.meta.crawlWarnings.length ? (
            <Card className="border-amber-500/30 bg-amber-500/[0.04]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-amber-900 dark:text-amber-100">
                  Avisos de rastreo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {result.meta.crawlWarnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
