import Link from "next/link";
import type { KeywordLandingInternalMeshItem } from "@/lib/seo/keyword-landings/types";

const DEFAULT_MESH_ITEMS: KeywordLandingInternalMeshItem[] = [
  {
    href: "/seo-audit",
    anchor: "SEO audit",
    description: "marco en inglés, útil para equipos mixtos y reporting internacional.",
  },
  {
    href: "/auditoria-seo",
    anchor: "Auditoría SEO",
    description: "conceptos, priorización y lectura en español para alinear a tu equipo.",
  },
  {
    href: "/herramienta-seo-gratis",
    anchor: "Herramienta SEO gratis",
    description: "entrada sin fricción al plan Free y cupos claros para empezar hoy.",
  },
];

/**
 * Malla interna obligatoria para landings SEO (mismas rutas en todas las URLs).
 */
export function SeoKeywordInternalMesh({
  lead,
  links,
}: {
  lead: string;
  links?: KeywordLandingInternalMeshItem[];
}) {
  const items = links ?? DEFAULT_MESH_ITEMS;
  return (
    <section className="mt-12 rounded-2xl border border-border/80 bg-muted/15 p-6 sm:p-8" aria-labelledby="internal-mesh-title">
      <h2 id="internal-mesh-title" className="text-xl font-bold tracking-tight text-foreground">
        Recursos relacionados (malla interna)
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{lead}</p>
      <ul className="mt-6 space-y-3 text-base text-muted-foreground">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="font-semibold text-primary underline-offset-4 hover:underline">
              {item.anchor}
            </Link>
            <span className="text-muted-foreground">
              {" "}
              — {item.description}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
