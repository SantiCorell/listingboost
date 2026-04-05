import type { Plan } from "@prisma/client";
import { Check, Minus } from "lucide-react";
import { APP_NAME, FREE_HISTORY_LIMIT } from "@/lib/constants";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { EXTRA_CREDIT_PRICE_EUR, PLAN_INCLUDED_ANALYSES, PLAN_PRICING_DISPLAY } from "@/lib/plans";
import { cn } from "@/lib/utils";

type CellVal = boolean | string;

type FeatureRow = {
  kind: "feature";
  feature: string;
  hint?: string;
  free: CellVal;
  pro: CellVal;
  proPlus: CellVal;
  enterprise: CellVal;
};

type SectionRow = { kind: "section"; title: string };

const rows: (SectionRow | FeatureRow)[] = [
  { kind: "section", title: "Cupo y precio" },
  {
    kind: "feature",
    feature: "Créditos incluidos / mes",
    hint: "Unidades para boosts, scans, IA, etc. Enterprise: sin tope (§).",
    free: String(PLAN_INCLUDED_ANALYSES.FREE),
    pro: String(PLAN_INCLUDED_ANALYSES.PRO),
    proPlus: String(PLAN_INCLUDED_ANALYSES.PRO_PLUS),
    enterprise: "Ilimitados §",
  },
  {
    kind: "feature",
    feature: "Precio suscripción",
    free: "0 €",
    pro: PLAN_PRICING_DISPLAY.PRO.label,
    proPlus: PLAN_PRICING_DISPLAY.PRO_PLUS.label,
    enterprise: PLAN_PRICING_DISPLAY.ENTERPRISE.label,
  },
  {
    kind: "feature",
    feature: "Crédito extra (compra suelta)",
    hint: "Si superas el cupo en otros planes. Enterprise no lo necesita (§).",
    free: `${EXTRA_CREDIT_PRICE_EUR.FREE} €/u`,
    pro: `${EXTRA_CREDIT_PRICE_EUR.PRO} €/u`,
    proPlus: `${EXTRA_CREDIT_PRICE_EUR.PRO_PLUS} €/u`,
    enterprise: "Opcional §",
  },

  { kind: "section", title: "Catálogo, URL y motor" },
  {
    kind: "feature",
    feature: "Boost multicanal (fichas marketplace)",
    free: true,
    pro: true,
    proPlus: true,
    enterprise: true,
  },
  {
    kind: "feature",
    feature: "Copia exportada sin pie de marca",
    hint: "En Free el texto generado puede incluir referencia a ListingBoost.",
    free: false,
    pro: true,
    proPlus: true,
    enterprise: true,
  },
  {
    kind: "feature",
    feature: "Scan SEO de URL (motor + score + issues)",
    free: true,
    pro: true,
    proPlus: true,
    enterprise: true,
  },
  {
    kind: "feature",
    feature: "Arreglos 1‑clic (title / meta / H1)",
    free: true,
    pro: true,
    proPlus: true,
    enterprise: true,
  },
  {
    kind: "feature",
    feature: "Generador SEO (blog / producto) + blog optimizer",
    free: true,
    pro: true,
    proPlus: true,
    enterprise: true,
  },
  {
    kind: "feature",
    feature: "Historial de trabajos guardados",
    free: `Últimos ${FREE_HISTORY_LIMIT}`,
    pro: "Completo",
    proPlus: "Completo",
    enterprise: "Completo",
  },

  { kind: "section", title: "SEO Engine" },
  {
    kind: "feature",
    feature: "Comparativa vs competidor (2 URLs)",
    hint: `En Free/Pro/Pro+: ${FEATURE_CREDITS.COMPETITOR_COMPARE} cr por ejecución. Enterprise: sin descuento de cupo (§).`,
    free: false,
    pro: `${FEATURE_CREDITS.COMPETITOR_COMPARE} cr / análisis`,
    proPlus: `${FEATURE_CREDITS.COMPETITOR_COMPARE} cr / análisis`,
    enterprise: "Incluido §",
  },
  {
    kind: "feature",
    feature: "Monitoring SERP (cron + alertas)",
    free: false,
    pro: "Semanal",
    proPlus: "Diario o semanal",
    enterprise: "Diario o semanal",
  },
  {
    kind: "feature",
    feature: "Informe SERP premium vs competidores",
    hint:
      "Quién rankea por encima y por qué, plan por fases. Pro/Pro+: consume créditos; Enterprise: sin descuento (§).",
    free: false,
    pro: `${FEATURE_CREDITS.SERP_COMPETITOR_INSIGHT} cr / informe`,
    proPlus: `${FEATURE_CREDITS.SERP_COMPETITOR_INSIGHT} cr / informe`,
    enterprise: "Incluido §",
  },
  {
    kind: "feature",
    feature: "SEO Gap Finder AI",
    hint:
      "SERP real (SerpAPI) + crawl de competidores + oportunidades priorizadas con acciones y URLs sugeridas. Caché 24 h.",
    free: false,
    pro: false,
    proPlus: `${FEATURE_CREDITS.SEO_GAP_FINDER} cr / informe`,
    enterprise: "Incluido §",
  },

  { kind: "section", title: "PDF e informes" },
  {
    kind: "feature",
    feature: "Auditoría URL: vista para imprimir (navegador)",
    hint: "Desde el historial; no descarga PDF del servidor.",
    free: "Sin crédito",
    pro: "Sin crédito",
    proPlus: "Sin crédito",
    enterprise: "Sin crédito",
  },
  {
    kind: "feature",
    feature: "Auditoría URL: PDF descargable multipágina",
    hint: "Listo para archivo o cliente; distinto de guardar desde «Imprimir». Enterprise: sin descuento (§).",
    free: "1 crédito†",
    pro: "1 crédito†",
    proPlus: "1 crédito†",
    enterprise: "Incluido §",
  },
  {
    kind: "feature",
    feature: "Comparativa SEO: exportar a PDF",
    hint: "Pro+ y Enterprise incluyen PDF comparativa; Enterprise además sin tope de cupo (§).",
    free: "—",
    pro: "1 crédito‡",
    proPlus: "Incluido‡",
    enterprise: "Incluido‡ §",
  },
  {
    kind: "feature",
    feature: "Informe SERP premium: guardado + PDF",
    hint: "El informe queda en Historial; el PDF descargable cuesta 1 cr (como auditoría URL). Enterprise §.",
    free: "—",
    pro: "Historial + PDF 1 cr",
    proPlus: "Historial + PDF 1 cr",
    enterprise: "Historial + PDF §",
  },

  { kind: "section", title: "Escala y relación con el producto" },
  {
    kind: "feature",
    feature: "Prioridad en evolución del roadmap",
    free: false,
    pro: true,
    proPlus: true,
    enterprise: true,
  },
  {
    kind: "feature",
    feature: "Condiciones comerciales y soporte prioritario",
    hint: "Checkout online 100 €/mes o acuerdos a medida con el equipo.",
    free: false,
    pro: false,
    proPlus: false,
    enterprise: true,
  },
];

function Cell({ v }: { v: CellVal }) {
  if (typeof v === "string") {
    return <span className="text-xs font-medium leading-snug text-foreground">{v}</span>;
  }
  return v ? (
    <Check className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" />
  );
}

function planColumnClass(plan: Plan, col: "FREE" | "PRO" | "PRO_PLUS" | "ENTERPRISE"): string {
  if (plan !== col) return "";
  return "bg-primary/[0.08] ring-1 ring-inset ring-primary/15";
}

export function PlanFeatureMatrix({ currentPlan }: { currentPlan?: Plan }) {
  const p = currentPlan ?? "FREE";

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/90 shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="sticky left-0 z-[1] min-w-[200px] bg-muted/50 px-4 py-3 text-left font-semibold backdrop-blur-sm">
              Funcionalidad
            </th>
            <th
              className={cn(
                "px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide sm:px-3 sm:text-sm sm:normal-case sm:tracking-normal",
                planColumnClass(p, "FREE"),
              )}
            >
              Free
            </th>
            <th
              className={cn(
                "px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide sm:px-3 sm:text-sm sm:normal-case sm:tracking-normal",
                planColumnClass(p, "PRO"),
                "bg-gradient-to-b from-primary/[0.12] to-transparent",
              )}
            >
              <span className="block">Pro</span>
              <span className="mt-0.5 hidden text-[10px] font-normal text-muted-foreground sm:block">
                Ritmo semanal
              </span>
            </th>
            <th
              className={cn(
                "px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide sm:px-3 sm:text-sm sm:normal-case sm:tracking-normal",
                planColumnClass(p, "PRO_PLUS"),
              )}
            >
              <span className="block">Pro+</span>
              <span className="mt-0.5 hidden text-[10px] font-normal text-muted-foreground sm:block">
                Volumen · diario
              </span>
            </th>
            <th
              className={cn(
                "px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide sm:px-3 sm:text-sm sm:normal-case sm:tracking-normal",
                planColumnClass(p, "ENTERPRISE"),
              )}
            >
              <span className="block">Enterprise</span>
              <span className="mt-0.5 hidden text-[10px] font-normal text-muted-foreground sm:block">
                100 € · cupo ilimitado
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            if (row.kind === "section") {
              return (
                <tr key={row.title} className="border-b border-border/50 bg-muted/25">
                  <th
                    colSpan={5}
                    scope="colgroup"
                    className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {row.title}
                  </th>
                </tr>
              );
            }
            return (
              <tr
                key={row.feature}
                className="border-b border-border/50 transition-colors hover:bg-muted/15 last:border-0"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-[1] max-w-[240px] bg-card/95 px-4 py-3 text-left align-top font-normal backdrop-blur-sm"
                >
                  <span className="text-foreground">{row.feature}</span>
                  {row.hint ? (
                    <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">{row.hint}</span>
                  ) : null}
                </th>
                <td className={cn("px-2 py-3 text-center align-top sm:px-3", planColumnClass(p, "FREE"))}>
                  <Cell v={row.free} />
                </td>
                <td className={cn("bg-primary/[0.03] px-2 py-3 text-center align-top sm:px-3", planColumnClass(p, "PRO"))}>
                  <Cell v={row.pro} />
                </td>
                <td className={cn("px-2 py-3 text-center align-top sm:px-3", planColumnClass(p, "PRO_PLUS"))}>
                  <Cell v={row.proPlus} />
                </td>
                <td className={cn("px-2 py-3 text-center align-top sm:px-3", planColumnClass(p, "ENTERPRISE"))}>
                  <Cell v={row.enterprise} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        id="notas-precios-pdf"
        className="space-y-3 border-t border-border/60 bg-muted/10 px-4 py-4 text-xs leading-relaxed text-muted-foreground"
      >
        <p>
          <strong className="text-foreground">§ Plan Enterprise (100 €/mes en checkout online):</strong> cupo de
          créditos <strong className="text-foreground">ilimitado</strong> para uso profesional razonable. Boosts, scans
          URL, comparativas, informe SERP premium, PDFs y el resto de acciones que en otros planes descuentan unidades{" "}
          <strong className="text-foreground">no consumen</strong> cupo ni créditos extra. Seguimos registrando uso para
          soporte y mejora del producto; ante abusos extremos (automatización masiva, reventa) podemos contactarte o
          revisar el acuerdo.
        </p>
        <p>
          <strong className="text-foreground">† PDF de auditoría URL:</strong> la{" "}
          <strong className="text-foreground">vista para imprimir</strong> desde el historial{" "}
          <strong className="text-foreground">no consume créditos</strong>. El{" "}
          <strong className="text-foreground">PDF descargable multipágina</strong> cuesta{" "}
          <strong className="text-foreground">1 crédito por exportación</strong> en Free, Pro y Pro+; en Enterprise
          aplica la política §.
        </p>
        <p>
          <strong className="text-foreground">‡ PDF de comparativa SEO:</strong> en{" "}
          <strong className="text-foreground">Free y Pro</strong>, cada exportación a PDF cuesta{" "}
          <strong className="text-foreground">1 crédito</strong>. En <strong className="text-foreground">Pro+</strong>{" "}
          y <strong className="text-foreground">Enterprise</strong> ese PDF va{" "}
          <strong className="text-foreground">incluido</strong> (sin cargo adicional en créditos); en Enterprise el
          conjunto del producto sigue §.
        </p>
        <p>
          <strong className="text-foreground">Posicionamiento SEO y monitoring:</strong> el seguimiento SERP te muestra
          dónde aparece tu URL en Google para una consulta concreta y su evolución. El informe premium añade contexto de
          competidores por encima (crawl + IA) y un plan por fases; en Pro y Pro+ cuesta{" "}
          <strong className="text-foreground">{FEATURE_CREDITS.SERP_COMPETITOR_INSIGHT} créditos</strong> por ejecución.
          El núcleo de{" "}
          <strong className="text-foreground">{APP_NAME}</strong> es el mismo en todos los planes.
        </p>
      </div>
    </div>
  );
}
