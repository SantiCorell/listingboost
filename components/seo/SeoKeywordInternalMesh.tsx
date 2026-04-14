import Link from "next/link";

/**
 * Malla interna obligatoria para landings SEO (mismas rutas en todas las URLs).
 */
export function SeoKeywordInternalMesh({ lead }: { lead: string }) {
  return (
    <section className="mt-12 rounded-2xl border border-border/80 bg-muted/15 p-6 sm:p-8" aria-labelledby="internal-mesh-title">
      <h2 id="internal-mesh-title" className="text-xl font-bold tracking-tight text-foreground">
        Recursos relacionados (malla interna)
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{lead}</p>
      <ul className="mt-6 space-y-3 text-base text-muted-foreground">
        <li>
          <Link href="/seo-audit" className="font-semibold text-primary underline-offset-4 hover:underline">
            SEO audit
          </Link>
          <span className="text-muted-foreground">
            {" "}
            — marco en inglés, útil para equipos mixtos y reporting internacional.
          </span>
        </li>
        <li>
          <Link href="/auditoria-seo" className="font-semibold text-primary underline-offset-4 hover:underline">
            Auditoría SEO
          </Link>
          <span className="text-muted-foreground">
            {" "}
            — conceptos, priorización y lectura en español para alinear a tu equipo.
          </span>
        </li>
        <li>
          <Link
            href="/herramienta-seo-gratis"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Herramienta SEO gratis
          </Link>
          <span className="text-muted-foreground">
            {" "}
            — entrada sin fricción al plan Free y cupos claros para empezar hoy.
          </span>
        </li>
      </ul>
    </section>
  );
}
