import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { getPublicContactEmail } from "@/lib/contact";
import { ContactMailtoForm } from "@/components/contact/contact-mailto-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { ArrowRight, Clock, Mail, MessageCircle, Sparkles } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Contacta con ${APP_NAME}: soporte, planes Enterprise, partnerships y dudas sobre ${ENGINE_NAME}. Respuesta humana, sin formularios eternos.`,
  keywords: [
    "contacto ListingBoost",
    "soporte optimización listings",
    "Enterprise SEO marketplace",
    "ListingBrain consulta",
  ],
  openGraph: {
    title: `Contacto · ${APP_NAME}`,
    description: "Habla con el equipo: ventas, soporte y propuestas a medida.",
    url: `${siteUrl}/contacto`,
  },
  alternates: { canonical: `${siteUrl}/contacto` },
};

const faqs = [
  {
    q: "¿Cuánto tardáis en responder?",
    a: "Objetivo laborable: menos de un día hábil. Consultas Enterprise o integraciones pueden requerir una segunda vuelta con más detalle técnico.",
  },
  {
    q: "¿Puedo pedir demo o propuesta Enterprise?",
    a: "Sí. Indica volumen aproximado de análisis al mes, canales (marketplaces, tienda propia) y si necesitas facturación o requisitos legales. Te contestamos con siguiente paso claro.",
  },
];

export default function ContactoPage() {
  const email = getPublicContactEmail();
  const jsonLd = faqPageJsonLd(faqs);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Contacto", url: `${siteUrl}/contacto` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-tech-radial opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-tech-grid opacity-40" />

        <article className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Estamos aquí</p>
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Contacto <span className="text-gradient-brand">{APP_NAME}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              Soporte, facturación, planes altos y alianzas. Sin bucles de chatbot: escribes, leemos y respondemos.
              Nuestro motor <strong className="text-foreground">{ENGINE_NAME}</strong> va del tono de marca a hashtags
              y reglas por canal — si necesitas ayuda humana encajarlo en tu operación, este es el sitio.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
            <Card className="border-border/80 bg-card/90 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/25">
              <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
                <Mail className="h-8 w-8 text-primary" />
                <p className="text-sm font-semibold">Email directo</p>
                <a href={`mailto:${email}`} className="break-all text-sm text-muted-foreground hover:text-primary">
                  {email}
                </a>
              </CardContent>
            </Card>
            <Card className="border-border/80 bg-card/90 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/25">
              <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
                <Clock className="h-8 w-8 text-primary" />
                <p className="text-sm font-semibold">Tiempo de respuesta</p>
                <p className="text-sm text-muted-foreground">Menos de 24 h laborables</p>
              </CardContent>
            </Card>
            <Card className="border-border/80 bg-card/90 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/25">
              <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
                <MessageCircle className="h-8 w-8 text-primary" />
                <p className="text-sm font-semibold">Ventas y Enterprise</p>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Propuestas, cupos altos y roadmap
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card to-violet-500/[0.06] p-6 shadow-lg sm:p-8">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h2 className="text-xl font-bold">Antes de escribir</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <li>
                      <Link href="/producto" className="font-medium text-primary hover:underline">
                        Centro de producto
                      </Link>{" "}
                      — qué hace boost, scan URL y hashtags.
                    </li>
                    <li>
                      <Link href="/pricing" className="font-medium text-primary hover:underline">
                        Precios
                      </Link>{" "}
                      — cupos, créditos y Pro/Pro+.
                    </li>
                    <li>
                      <Link href="/register" className="font-medium text-primary hover:underline">
                        Cuenta gratis
                      </Link>{" "}
                      — prueba el flujo real sin tarjeta.
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="mt-6 gap-2 border-primary/25">
                    <Link href="/register">
                      Registrarse gratis
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-border/80 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold">Enviar mensaje</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Rellena el formulario y confirma en tu app de correo. Así evitamos spam y tú controlas el envío.
                </p>
                <div className="mt-6">
                  <ContactMailtoForm toEmail={email} />
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="mx-auto mt-16 max-w-2xl rounded-2xl border border-border/70 bg-muted/25 p-6 sm:p-8">
            <h2 className="text-lg font-bold">Preguntas rápidas</h2>
            <dl className="mt-4 space-y-4 text-sm">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-muted-foreground leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </div>
    </>
  );
}
