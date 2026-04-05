import Link from "next/link";
import type { Metadata } from "next";
import {
  GrowthArticleShell,
  GrowthBeforeAfter,
  GrowthCtaCluster,
  GrowthRelatedLinks,
  GrowthSection,
  GrowthTipList,
  GrowthToolPitch,
} from "@/components/seo/growth-landing-layout";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "SEO Wallapop: más visitas y ventas en tus anuncios (IA)",
  description:
    "Guía práctica de SEO Wallapop: títulos, descripción, fotos y señales de confianza. Usa ListingBoost con ListingBrain™ para optimizar listings y vender más.",
  keywords: [
    "seo wallapop",
    "posicionar anuncio wallapop",
    "titulo wallapop vende",
    "descripcion wallapop seo",
    "vender mas wallapop",
  ],
  openGraph: {
    title: `SEO Wallapop · ${APP_NAME}`,
    description: "Optimiza títulos y descripciones con IA pensada para marketplaces.",
    url: `${siteUrl}/seo-wallapop`,
  },
  alternates: { canonical: `${siteUrl}/seo-wallapop` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/optimizar-listings-wallapop", label: "Ver cómo optimizar listings en Wallapop paso a paso" },
  { href: "/como-vender-mas-en-wallapop", label: "Guía: cómo vender más en Wallapop" },
  { href: "/generador-titulos-productos", label: "Usar un generador de títulos SEO para productos" },
  { href: "/no-vendo-en-wallapop", label: "Si no vendes: diagnóstico rápido" },
];

export default function SeoWallapopPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "SEO Wallapop", url: `${siteUrl}/seo-wallapop` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "SEO Wallapop" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          SEO en Wallapop: cómo ganar visibilidad y cerrar más ventas
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Wallapop no es Google, pero <strong className="text-foreground">sí hay competencia por atención</strong>: quien
          escribe mejor título y descripción, sube fotos claras y responde rápido, suele vender antes. Esta guía resume
          qué funciona en la práctica y cómo <Link href="/register" className="font-medium text-primary hover:underline">analizar tu listing gratis</Link> con{" "}
          {APP_NAME}.
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué tu anuncio no aparece ‘como quieres’">
          <p>
            El buscador interno y los listados mezclan proximidad, recencia, palabras clave en el título y señales de
            confianza (perfil verificado, reseñas, tiempo de respuesta). Si pones un título vago (“vendo móvil”) o una
            descripción de una línea, el comprador no tiene motivos para pinchar — y Wallapop tampoco tiene texto con el
            que emparejar búsquedas largas (“iPhone 13 128 azul buen estado”).
          </p>
          <p>
            El error más habitual es copiar el nombre del producto del fabricante sin el detalle que la gente busca:
            talla, capacidad, año, compatibilidad, si incluye caja o factura. Eso no es “truco SEO”: es información que
            reduce dudas y sube el CTR de tu anuncio.
          </p>
        </GrowthSection>

        <GrowthSection title="Cómo arreglarlo: checklist que sí mueve el aguja">
          <p>
            Piensa en tres capas: <strong className="text-foreground">qué es</strong>,{" "}
            <strong className="text-foreground">qué condición tiene</strong> y{" "}
            <strong className="text-foreground">por qué comprarte a ti</strong>. Luego tradúcelo a un título corto y una
            descripción escaneable con viñetas.
          </p>
          <GrowthTipList
            items={[
              "Título: marca + modelo + atributo clave (talla, GB, cm) + estado en pocas palabras.",
              "Descripción: estado real, defectos visibles, lo que incluye envío/recogida, política de devolución si aplica.",
              "Palabras de intención: “negociable”, “urgente”, “como nuevo” solo si es verdad; la confianza se nota.",
              "Fotos: primera imagen legible, fondo limpio, detalle de rozaduras; evita capturas borrosas.",
              "Actualiza el anuncio si bajas precio o cambias disponibilidad; el refresco ayuda a la recencia percibida.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Ejemplo rápido (antes / después)">
          <GrowthBeforeAfter
            before="Zapatillas nike talla 42"
            after="Nike Air Max 90 talla 42 EU — poco uso, suela limpia, sin caja · envío o mano en Madrid"
          />
          <p className="mt-4">
            El segundo título responde a búsquedas más específicas y reduce preguntas repetidas. Eso es{" "}
            <strong className="text-foreground">SEO de marketplace</strong> aplicado: menos fricción, más conversación
            seria.
          </p>
        </GrowthSection>

        <GrowthSection title="Consejos SEO específicos para Wallapop">
          <GrowthTipList
            items={[
              "Incluye sinónimos naturales que use la gente (zapatillas / bambas / sneakers) sin relleno artificial.",
              "Si vendes electrónica, menciona batería, iCloud/desbloqueo, garantía restante; son filtros mentales del comprador.",
              "Evita MAYÚSCULAS en todo el título; parece spam y cansa a la vista.",
              "Cierra objeciones en la descripción: envío 24h, prueba en mano, factura, comprueba IMEI.",
              "Si tienes varias unidades, evita duplicar el mismo texto: personaliza mínimo el titular.",
            ]}
          />
        </GrowthSection>

        <GrowthToolPitch />

        <GrowthSection title="Pasa del texto mediocre al texto que vende">
          <p>
            Con {ENGINE_NAME} generas variantes por canal manteniendo hechos que tú proporcionas: no inventamos
            especificaciones. Ideal si gestionas muchas referencias o quieres{" "}
            <Link href="/dashboard/product" className="font-medium text-primary hover:underline">
              probar otro ángulo de titular
            </Link>{" "}
            sin reescribir desde cero.
          </p>
        </GrowthSection>

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
