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
        sub: "100 €/mes · cupo ilimitado y prioridad",
      };
    case "ENTERPRISE":
      return {
        href: "/pricing",
        label: "Tu plan Enterprise",
        sub: "Cupo ilimitado · contacto para condiciones a medida",
      };
    default:
      return { href: "/pricing", label: "Ver planes", sub: "" };
  }
}
