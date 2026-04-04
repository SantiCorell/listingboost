import type { Plan } from "@prisma/client";

export function headerUpsell(
  plan: Plan | undefined,
  commerceEnabled: boolean,
): {
  href: string;
  label: string;
  sub: string;
  disabled?: boolean;
} {
  if (!commerceEnabled) {
    return {
      href: "#",
      label: "Pagos próximamente",
      sub: "Planes y créditos cuando Stripe esté listo",
      disabled: true,
    };
  }

  const p = plan ?? "FREE";
  switch (p) {
    case "FREE":
      return {
        href: "/pricing",
        label: "Desbloquear Pro",
        sub: "Más análisis, sin marca de agua, historial completo",
      };
    case "PRO":
      return {
        href: "/pricing",
        label: "Subir a Pro+",
        sub: "Más cupo mensual y créditos más baratos",
      };
    case "PRO_PLUS":
      return {
        href: "/pricing",
        label: "Enterprise",
        sub: "Volumen, prioridad y condiciones a medida",
      };
    case "ENTERPRISE":
      return {
        href: "/pricing/credits",
        label: "Recargar créditos",
        sub: "Checkout Stripe con la cantidad que necesites",
      };
    default:
      return { href: "/pricing", label: "Ver planes", sub: "" };
  }
}
