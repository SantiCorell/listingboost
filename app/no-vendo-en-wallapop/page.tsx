import Link from "next/link";
import type { Metadata } from "next";
import {
  GrowthArticleShell,
  GrowthCtaCluster,
  GrowthRelatedLinks,
  GrowthSection,
  GrowthTipList,
  GrowthToolPitch,
} from "@/components/seo/growth-landing-layout";
import { APP_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "No vendo en Wallapop: causas y soluciones que sí funcionan",
  description:
    "Si no vendes en Wallapop: precio, fotos, título, confianza y timing. Checklist práctica + ListingBoost para reescribir tu anuncio gratis (cupo Free).",
  keywords: ["no vendo en wallapop", "wallapop no vendo", "anuncio wallapop sin vistas", "vender wallapop rapido"],
  openGraph: {
    title: `No vendo en Wallapop · ${APP_NAME}`,
    url: `${siteUrl}/no-vendo-en-wallapop`,
  },
  alternates: { canonical: `${siteUrl}/no-vendo-en-wallapop` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/como-vender-mas-en-wallapop", label: "Cómo vender más en Wallapop" },
  { href: "/seo-wallapop", label: "SEO Wallapop" },
  { href: "/por-que-no-vendo-productos", label: "Por qué no vendo productos (guía general)" },
];

export default function NoVendoWallapopPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "No vendo en Wallapop", url: `${siteUrl}/no-vendo-en-wallapop` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "No vendo en Wallapop" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          No vendo en Wallapop: diagnóstico honesto y qué cambiar primero
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          No es “mala suerte” en la mayoría de casos: es un combo de señal débil (título/fotos/precio) y fricción alta
          (poco detalle, respuesta lenta). Vamos al grano y te dejamos un camino para{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            rehacer tu listing gratis
          </Link>{" "}
          con {APP_NAME}.
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Causas típicas (de la más frecuente a la más ignorada)">
          <GrowthTipList
            items={[
              "Precio fuera de mercado sin justificar (factura, garantía, extras).",
              "Fotos oscuras o sin detalle de defectos; el comprador asume lo peor.",
              "Título vago: no aparece modelo/talla/medida.",
              "Descripción de una línea: parece estafa o falta de seriedad.",
              "Respuestas lentas: en Wallapop el tiempo mata la venta caliente.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Qué hacer hoy (orden recomendado)">
          <p>
            1) Mira 5 anuncios competidores con ventas o conversación activa: qué muestran que tú no. 2) Ajusta precio o
            justifícalo en texto. 3) Resube fotos con luz uniforme y macro de defectos. 4) Reescribe título + descripción
            con datos duros. 5) Responde en &lt;30 min durante 48h.
          </p>
        </GrowthSection>

        <GrowthSection title="Cómo ListingBoost te ayuda cuando estás bloqueado">
          <p>
            Si no sabes cómo decirlo, el boost de ficha te propone estructura y variantes{" "}
            <Link href="/dashboard/product" className="font-medium text-primary hover:underline">
              listas para copiar
            </Link>
            . Tú mantienes control de hechos y políticas.
          </p>
        </GrowthSection>

        <GrowthToolPitch />

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
