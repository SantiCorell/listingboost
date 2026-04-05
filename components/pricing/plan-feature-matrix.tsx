import type { Plan } from "@prisma/client";
import { Check, Minus } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { PLAN_INCLUDED_ANALYSES } from "@/lib/plans";
import { cn } from "@/lib/utils";

type Row = { feature: string; free: boolean | string; pro: boolean | string; proPlus: boolean | string };

const rows: Row[] = [
  {
    feature: "Boost multicanal (fichas marketplace)",
    free: true,
    pro: true,
    proPlus: true,
  },
  {
    feature: "Scan SEO URL (motor + issues + score)",
    free: true,
    pro: true,
    proPlus: true,
  },
  {
    feature: "Informe IA + PDF + comparativas avanzadas",
    free: "Básico / con créditos",
    pro: "Completo",
    proPlus: "Completo + prioridad evolución",
  },
  {
    feature: "Arreglos 1‑clic (title / meta / H1)",
    free: true,
    pro: true,
    proPlus: true,
  },
  {
    feature: "Generador de contenido (blog / producto)",
    free: true,
    pro: true,
    proPlus: true,
  },
  {
    feature: "Blog optimizer (reescritura SEO)",
    free: true,
    pro: true,
    proPlus: true,
  },
  {
    feature: "Comparativa vs competidor (dos URLs)",
    free: false,
    pro: true,
    proPlus: true,
  },
  {
    feature: "Seguimiento posiciones + histórico (cron)",
    free: false,
    pro: true,
    proPlus: "Diario o semanal",
  },
  {
    feature: "Cupo mensual (unidades de crédito)",
    free: String(PLAN_INCLUDED_ANALYSES.FREE),
    pro: String(PLAN_INCLUDED_ANALYSES.PRO),
    proPlus: String(PLAN_INCLUDED_ANALYSES.PRO_PLUS),
  },
];

function Cell({ v }: { v: boolean | string }) {
  if (typeof v === "string") {
    return <span className="text-xs font-medium leading-snug text-foreground">{v}</span>;
  }
  return v ? (
    <Check className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" />
  );
}

export function PlanFeatureMatrix({ currentPlan }: { currentPlan?: Plan }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/90 shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-3 text-left font-semibold">Funcionalidad</th>
            <th
              className={cn(
                "px-3 py-3 text-center font-semibold",
                currentPlan === "FREE" && "bg-primary/10",
              )}
            >
              Free
            </th>
            <th
              className={cn(
                "px-3 py-3 text-center font-semibold",
                currentPlan === "PRO" && "bg-primary/10",
              )}
            >
              Pro
            </th>
            <th
              className={cn(
                "px-3 py-3 text-center font-semibold",
                (currentPlan === "PRO_PLUS" || currentPlan === "ENTERPRISE") && "bg-primary/10",
              )}
            >
              Pro+ / Growth
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3 text-muted-foreground">{row.feature}</td>
              <td className="px-3 py-3 text-center align-top">
                <Cell v={row.free} />
              </td>
              <td className="px-3 py-3 text-center align-top">
                <Cell v={row.pro} />
              </td>
              <td className="px-3 py-3 text-center align-top">
                <Cell v={row.proPlus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
        Free incluye el núcleo de {APP_NAME} con cupo reducido; Pro desbloquea{" "}
        <strong className="text-foreground">monitoring SERP</strong> y mejor precio por crédito; Pro+ añade volumen
        y cadencia diaria en monitoring. Todo lo que gasta créditos puede recargarse aparte.
      </p>
    </div>
  );
}
