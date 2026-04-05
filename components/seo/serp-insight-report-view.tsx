import type { SerpCompetitorInsightOutput } from "@/types/serp-competitor-insight";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  Gauge,
  Globe2,
  Lightbulb,
  ListOrdered,
  Scale,
  Target,
  Timer,
  Users,
  Zap,
} from "lucide-react";

function phaseBadgeClass(phase: string) {
  const p = phase.toLowerCase();
  if (p.includes("inmediat")) return "border-emerald-300/60 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100";
  if (p.includes("corto")) return "border-sky-300/60 bg-sky-50 text-sky-950 dark:bg-sky-950/40 dark:text-sky-100";
  if (p.includes("medio")) return "border-violet-300/60 bg-violet-50 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100";
  return "border-border bg-muted/50";
}

export function SerpInsightReportView({
  data,
  keyword,
  pageUrl,
  positionLabel,
  /** Ocultar cabecera de marca si ya hay chrome (p. ej. diálogo a pantalla completa). */
  hideBrandRail = false,
}: {
  data: SerpCompetitorInsightOutput;
  keyword: string;
  pageUrl: string;
  /** Ej. "Posición ~9" o "Sin posición en el tramo analizado" */
  positionLabel?: string | null;
  hideBrandRail?: boolean;
}) {
  return (
    <div className="space-y-6">
      {!hideBrandRail ? (
        <div className="flex items-center gap-3 rounded-xl border border-violet-200/70 bg-gradient-to-r from-violet-100/90 to-purple-50/70 px-4 py-3 dark:border-violet-500/30 dark:from-violet-950/50 dark:to-purple-950/30">
          <Image
            src="/icon.svg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-lg shadow-sm ring-1 ring-black/5 dark:ring-white/10"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight text-foreground">ListingBoost</p>
            <p className="text-xs text-muted-foreground">Informe SERP vs competidores</p>
          </div>
        </div>
      ) : null}

      {(keyword || pageUrl || positionLabel) && (
        <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm">
          {keyword ? (
            <p>
              <span className="text-muted-foreground">Consulta: </span>
              <strong className="text-foreground">«{keyword}»</strong>
            </p>
          ) : null}
          {pageUrl ? (
            <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">{pageUrl}</p>
          ) : null}
          {positionLabel ? (
            <p className="mt-2 text-xs text-muted-foreground">
              <strong className="text-foreground">Situación en SERP:</strong> {positionLabel}
            </p>
          ) : null}
        </div>
      )}

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Target className="h-4 w-4 text-primary" />
          Resumen ejecutivo
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {data.executiveSummary}
        </p>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Gauge className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          Contexto de búsqueda
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {data.marketContext}
        </p>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Globe2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Cómo encaja esto en Google (sin mitos)
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {data.howGoogleEvaluatesThisQuery}
        </p>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Scale className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          Lo que tienen por encima y tú aún no
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {data.whatTopResultsDoThatYouDont}
        </p>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Timer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          Volatilidad y plazos realistas
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {data.volatilityAndRealisticTimelines}
        </p>
      </section>

      <Separator />

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          Competidores analizados (por encima en esta consulta)
        </h3>
        <ul className="mt-3 space-y-4">
          {data.competitorCards.map((c, i) => (
            <li
              key={`${c.url}-${i}`}
              className="rounded-xl border border-violet-200/50 bg-violet-50/40 p-4 dark:border-violet-500/20 dark:bg-violet-950/25"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono text-[10px]">
                  #{c.serpPosition}
                </Badge>
                <span className="break-all text-xs font-medium text-foreground">{c.url}</span>
              </div>
              <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
                {c.strengthsObserved.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm leading-snug text-foreground">{c.whatTheyDoBetter}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          Tu página
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {data.yourUrlDiagnosis}
        </p>
      </section>

      <Separator />

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ListOrdered className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Plan de acción priorizado
        </h3>
        <ol className="mt-4 space-y-4">
          {[...data.prioritizedActions]
            .sort((a, b) => a.order - b.order)
            .map((a) => (
              <li key={a.order} className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                    {a.order}
                  </span>
                  <span className="font-semibold text-foreground">{a.title}</span>
                  <Badge variant="outline" className={`text-[10px] ${phaseBadgeClass(a.phase)}`}>
                    {a.phase.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    Esfuerzo: {a.effortLevel}
                  </Badge>
                </div>
                <ul className="mt-2 list-inside list-decimal text-sm text-muted-foreground">
                  {a.steps.map((s, j) => (
                    <li key={j} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-foreground/90">
                  <strong>Por qué importa:</strong> {a.whyItMatters}
                </p>
                <p className="mt-1 text-xs font-medium text-primary">
                  Tiempo estimado hasta efecto: {a.expectedTimeToEffect}
                </p>
              </li>
            ))}
        </ol>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          Métricas a vigilar
        </h3>
        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
          {data.metricsToWatch.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <p className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-3 text-xs text-muted-foreground">
        <Zap className="mb-1 inline h-3.5 w-3.5 text-primary" aria-hidden /> {data.honestDisclaimer}
      </p>
    </div>
  );
}
