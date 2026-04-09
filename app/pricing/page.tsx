import Link from "next/link";
import type { Metadata } from "next";
import type { Plan } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutPlanButton } from "@/components/pricing/checkout-plan-button";
import { PricingPlanFeatureList } from "@/components/pricing/pricing-plan-feature-list";
import { APP_NAME, ENGINE_NAME, FREE_HISTORY_LIMIT } from "@/lib/constants";
import { isCommerceEnabled } from "@/lib/commerce";
import { TRUST_STATS } from "@/lib/social-proof";
import { faqPageJsonLd } from "@/lib/seo-jsonld";
import { PlanFeatureMatrix } from "@/components/pricing/plan-feature-matrix";
import {
  EXTRA_CREDIT_PRICE_EUR,
  PLAN_INCLUDED_ANALYSES,
  PLAN_PRICING_DISPLAY,
  planLabel,
} from "@/lib/plans";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { getPublicContactEmail } from "@/lib/contact";
import { CREDIT_COST_PRODUCT, CREDIT_COST_URL_AUDIT } from "@/lib/usage";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  ChevronRight,
  Coins,
  CreditCard,
  Crown,
  Lock,
  Info,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Precios y planes",
  description: `Planes ${APP_NAME}: SEO operativo, auditoría de URLs, seguimiento en Google y listing multicanal con ${ENGINE_NAME}. Sin permanencia: cancelas cuando quieras; el acceso sigue hasta fin de periodo.`,
  keywords: [
    "precio ListingBoost",
    "herramienta SEO precio España",
    "cancelar suscripción SaaS",
    "plan SEO ecommerce",
    "auditoría URL precio",
    "seguimiento posiciones Google",
    "listing marketplace IA",
  ],
  openGraph: {
    title: `Precios · ${APP_NAME}`,
    description:
      "Elige el plan que encaje con tu volumen. Empieza gratis y pasa a Pro cuando el catálogo lo exija.",
    url: `${siteUrl}/pricing`,
  },
  alternates: { canonical: `${siteUrl}/pricing` },
};

const PRICING_CTA_CLASS =
  "inline-flex h-auto min-h-12 w-full flex-col items-center justify-center gap-0.5 whitespace-normal px-3 py-3 text-center text-sm font-semibold leading-snug sm:text-base";

/** Misma altura por fila (grid + h-full); en móvil ancho fijo + snap + min-h uniforme. */
const PLAN_CARD_BASE =
  "flex h-full min-h-0 w-full flex-col max-lg:min-h-[27.5rem] max-lg:w-[min(91vw,22rem)] max-lg:max-w-[22rem] max-lg:shrink-0 max-lg:snap-center";

const PLAN_CARD_HEADER = "shrink-0 space-y-1.5 pb-2 pt-6 max-lg:pb-1.5 max-lg:pt-5";

/** Cuerpo: móvil CTA arriba; desktop fila flexible + acordeón pegado abajo y CTAs alineados entre cards. */
const PLAN_CARD_CONTENT =
  "grid flex-1 grid-rows-[auto_auto] gap-3 p-6 pt-0 min-h-0 lg:grid-rows-[1fr_auto] lg:gap-4";

/** Enterprise online: precio dedicado o, si falta, mismo checkout que Pro+ con metadata ENTERPRISE. */
const enterpriseStripeReady =
  Boolean(process.env.STRIPE_PRICE_ID_ENTERPRISE?.trim()) ||
  Boolean(process.env.STRIPE_PRICE_ID_PRO_PLUS?.trim());

const pricingFaqs = [
  {
    q: "¿Cómo cancelo la suscripción?",
    a: "Entra en Ajustes de cuenta (perfil) y pulsa «Cancelar o gestionar mi plan». Ahí cancelas la renovación en un clic. Sigues con acceso completo hasta el último día del periodo que ya está pagado (normalmente el mismo día del mes en que empezó tu facturación). No se te cobra el siguiente ciclo.",
  },
  {
    q: "¿Puedo probar antes de pagar?",
    a: `Sí. El plan Free te permite usar ${APP_NAME} con un cupo mensual real: boost de ficha, scan de URL y hashtags. Cuando veas el ahorro de tiempo y la calidad del output, subir a Pro es un clic desde esta misma página.`,
  },
  {
    q: "¿Hay permanencia o letra pequeña?",
    a: "No hay permanencia. Puedes cancelar la renovación cuando quieras desde Ajustes. Queremos que sigas porque el producto te renta, no por cláusulas raras.",
  },
  {
    q: "¿El cobro del plan es solo una vez o cada mes?",
    a: "Los planes de pago son suscripciones mensuales: se renueva al inicio de cada periodo hasta que canceles desde Ajustes. Los créditos extra son compras aparte y no sustituyen la cuota del plan.",
  },
  {
    q: "¿Qué pasa si me paso del cupo mensual?",
    a: "Puedes comprar análisis extra (créditos) al precio unitario de tu plan actual. Cuanto más alto el plan, más barato sale cada análisis suelto. Así no te quedas parado en mitad de un lote de productos.",
  },
  {
    q: "¿Por qué pagar si tengo un chat de IA genérico?",
    a: `${ENGINE_NAME} no es un prompt suelto: aplica reglas por canal (Wallapop, eBay, Shopify…), estructura de salida lista para copiar, hashtags normalizados e informes de URL accionables. Pagas por velocidad, consistencia y menos edición manual.`,
  },
  {
    q: "¿El pago es seguro?",
    a: "Los cobros los procesa Stripe (tarjeta y métodos que tengas activos en tu cuenta). Nosotros no almacenamos los datos completos de tu tarjeta.",
  },
  {
    q: "¿Cómo contrato Pro si aún no tengo cuenta?",
    a: "Crea tu cuenta gratis en un minuto. En cuanto entres, vuelve a Precios (o guarda este enlace) y pulsa contratar: te llevamos al checkout de Stripe. Si ya tienes cuenta, inicia sesión y el botón te lleva directo al pago.",
  },
];

function formatEurPerAnalysis(euros: number, analyses: number): string {
  if (analyses <= 0) return "—";
  return (euros / analyses).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default async function PricingPage() {
  const session = await auth();
  let userPlan: Plan = "FREE";
  if (session?.user?.id) {
    const u = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    if (u) userPlan = u.plan;
  }

  const commerceEnabled = isCommerceEnabled();

  const freePlanBullets = [
    `Hasta ${PLAN_INCLUDED_ANALYSES.FREE} análisis incluidos/mes`,
    "Boost de ficha + scan URL + SEO Engine (generador, blog optimizer) + hashtags",
    `Historial limitado (últimos ${FREE_HISTORY_LIMIT}) · copia de ficha con pie de marca`,
    "Comparativa SEO y monitoring SERP: no incluidos (desde Pro)",
    commerceEnabled
      ? `Crédito extra: ${EXTRA_CREDIT_PRICE_EUR.FREE} €/u`
      : "Compra de créditos extra: próximamente",
  ];

  const proPlanBullets = [
    "Historial completo · copias de ficha sin pie de marca",
    `SEO Engine: comparativa (${FEATURE_CREDITS.COMPETITOR_COMPARE} cr/ejec.) + monitoring SERP semanal`,
    "Informes: imprimir vista sin crédito; PDF auditoría 1 cr† · PDF comparativa 1 cr‡",
    `Créditos extra ${EXTRA_CREDIT_PRICE_EUR.PRO} €/u`,
    "Cancelación desde tu cuenta cuando quieras · prioridad en evolución del producto",
  ];

  const proPlusPlanBullets = [
    "Todo lo de Pro con más cupo mensual",
    `SEO Gap Finder AI: SERP real + competidores + informe accionable (${FEATURE_CREDITS.SEO_GAP_FINDER} cr / ejecución)`,
    "Monitoring SERP en cadencia diaria o semanal",
    "PDF de comparativa SEO incluido (sin crédito extra ‡)",
    `Créditos extra al mejor precio: ${EXTRA_CREDIT_PRICE_EUR.PRO_PLUS} €/u`,
  ];

  const enterprisePlanBullets = [
    "Sin tope mensual de créditos: boosts, scan URL, generador SEO, blog optimizer, hashtags, comparativa, monitoring SERP y SEO Gap Finder AI cuando lo necesites.",
    "Informe SERP vs competidores premium sin descuento de cupo (en Pro/Pro+ consume créditos; aquí no).",
    "PDF de comparativa SEO incluido; PDFs de auditoría y exports alineados a la tabla de funciones (§ † ‡) sin sorpresas.",
    "Historial completo, copias sin pie de marca Free y créditos extra al precio Pro+ por si algún flujo legacy los requiere.",
    "Uso profesional razonable: protegemos la plataforma frente a abuso; el detalle legal está en términos — tú te centras en vender.",
    "Prioridad en soporte y roadmap de integraciones (API, webhooks, SSO) para escalar operaciones reales, no demos.",
  ];

  const proUnit = formatEurPerAnalysis(
    PLAN_PRICING_DISPLAY.PRO.euros,
    PLAN_INCLUDED_ANALYSES.PRO,
  );
  const proPlusUnit = formatEurPerAnalysis(
    PLAN_PRICING_DISPLAY.PRO_PLUS.euros,
    PLAN_INCLUDED_ANALYSES.PRO_PLUS,
  );

  const faqJson = faqPageJsonLd(pricingFaqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-tech-radial opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-tech-grid opacity-50" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
          {/* Hero conversión */}
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-primary hover:bg-primary/15">
              <Zap className="mr-1.5 h-3 w-3" />
              Invierte en catálogo, no en horas perdidas
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Precios pensados para que{" "}
              <span className="text-gradient-brand">cada listing te cueste menos</span> que hacerlo a mano
            </h1>
            <p className="mt-5 text-pretty text-lg text-muted-foreground sm:text-xl">
              Elige cuánto volumen necesitas. Empieza <strong className="text-foreground">sin tarjeta</strong> en
              Free, pasa a <strong className="text-foreground">Pro</strong> cuando el tiempo que ahorras valga
              mucho más que el precio del plan — y recarga con <strong className="text-foreground">créditos</strong>{" "}
              si un mes te pasas del cupo.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              {!session?.user ? (
                <>
                  <Button
                    size="lg"
                    className="h-12 gap-2 bg-gradient-to-r from-primary to-primary/90 px-8 text-base shadow-lg shadow-primary/25"
                    asChild
                  >
                    <Link href="/register">
                      Crear cuenta gratis
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                    <Link href="/login?callbackUrl=/pricing">Ya tengo cuenta — ir a pagar</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="h-12 gap-2 bg-gradient-to-r from-primary to-primary/90 px-8 text-base shadow-lg shadow-primary/25"
                    asChild
                  >
                    <a href="#planes">
                      Ver planes y contratar
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                    <Link href="/dashboard">Ir al panel ahora</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Pago con Stripe
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Sin permanencia forzada
              </span>
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Free sin tarjeta
              </span>
            </div>
          </div>

          {session?.user ? (
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 text-center">
              <p className="text-sm">
                Estás conectado como <strong className="text-foreground">{session.user.email}</strong> — plan
                actual:{" "}
                <Badge variant="secondary" className="mx-1 font-mono">
                  {planLabel(userPlan)}
                </Badge>
                {userPlan === "FREE" ? (
                  <>
                    . <span className="text-primary">Sube a Pro</span> para más análisis, historial completo, SEO Engine
                    (comparativa + monitoring) y copias de ficha sin pie de marca.
                  </>
                ) : userPlan === "PRO" ? (
                  <>
                    . ¿Necesitas más cupo? <span className="text-primary">Pro+</span> te da más análisis/mes y
                    créditos más baratos.
                  </>
                ) : null}
              </p>
            </div>
          ) : null}

          {/* Prueba social rápida */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: TRUST_STATS.productsAnalyzed, l: "Listings procesados" },
              { v: TRUST_STATS.sellersActive, l: "Operadores activos" },
              { v: TRUST_STATS.hoursSaved, l: "Horas ahorradas" },
              { v: TRUST_STATS.countries, l: "Países" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-border/70 bg-card/80 px-3 py-3 text-center shadow-sm backdrop-blur-sm"
              >
                <p className="text-lg font-bold tabular-nums sm:text-xl">{s.v}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Por qué pagar */}
          <section className="mx-auto mt-16 max-w-4xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Por qué tiene sentido pagar</h2>
            <p className="mx-auto mt-2 text-center text-muted-foreground">
              No vendemos “texto bonito”: vendemos <strong className="text-foreground">throughput</strong> y{" "}
              <strong className="text-foreground">calidad repetible</strong> para quien vive del catálogo.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: TrendingUp,
                  t: "Menos horas, mismas publicaciones",
                  d: "Cada análisis sustituye trabajo manual de título, bullets, hashtags o revisión SEO de una URL. Si publicas a menudo, el plan se paga solo en tiempo.",
                },
                {
                  icon: Sparkles,
                  t: `${ENGINE_NAME} por canal`,
                  d: "El output está calibrado para marketplaces y tiendas reales, no para respuestas genéricas. Copias, pegas y ajustas detalles que solo tú conoces.",
                },
                {
                  icon: Coins,
                  t: "Escala sin sorpresas",
                  d: "Cupo mensual claro + créditos cuando te pasas. Subes de plan cuando el negocio lo justifica — no antes.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <Card key={t} className="border-border/80 bg-card/90">
                  <CardContent className="p-6">
                    <Icon className="h-6 w-6 text-primary" />
                    <p className="mt-3 font-semibold">{t}</p>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Qué desbloqueas en cada plan</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
              <strong className="text-foreground">Free</strong> es el núcleo con cupo corto y sin comparativa ni
              monitoring. <strong className="text-foreground">Pro</strong> desbloquea SEO Engine completo, historial
              sin tope y mejor €/crédito. <strong className="text-foreground">Pro+</strong> sube volumen, cadencia
              diaria en SERP y PDF de comparativa incluido. <strong className="text-foreground">Enterprise</strong>{" "}
              (100 €/mes online) añade <strong className="text-foreground">cupo ilimitado</strong> para posicionamiento
              y catálogo sin fricción. Las notas <strong className="text-foreground">§ † ‡</strong> bajo la tabla cierran
              el detalle (PDFs, informe SERP {FEATURE_CREDITS.SERP_COMPETITOR_INSIGHT} cr en Pro/Pro+).
            </p>
            <div className="mt-8">
              <PlanFeatureMatrix currentPlan={userPlan} />
            </div>
          </section>

          {/* Planes */}
          <section id="planes" className="mt-20 scroll-mt-24">
            <div className="text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Elige tu plan</h2>
              <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                Todos incluyen el mismo núcleo tecnológico. La diferencia es{" "}
                <strong className="text-foreground">cuánto puedes ejecutar al mes</strong>,{" "}
                <strong className="text-foreground">cuánto cuesta cada análisis extra</strong> y si necesitas{" "}
                <strong className="text-foreground">cupo ilimitado</strong> (Enterprise).
              </p>
            </div>

            {!commerceEnabled ? (
              <div className="mx-auto mt-8 flex max-w-2xl gap-3 rounded-2xl border border-amber-500/35 bg-amber-500/[0.09] px-4 py-4 text-sm text-foreground sm:items-center">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
                <p className="text-left leading-relaxed">
                  <strong>Pagos en pausa.</strong> De momento solo está activo el <strong>plan Free</strong> (registro
                  y uso del producto). Los planes de pago y la compra de créditos con tarjeta los habilitaremos cuando
                  Stripe esté listo para cobrar.
                </p>
              </div>
            ) : null}

            <p className="mt-6 text-center text-xs text-muted-foreground lg:hidden">
              Desliza horizontalmente para comparar los cuatro planes.
            </p>
            <div className="mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-visible pb-4 [scrollbar-width:thin] max-lg:-mx-4 max-lg:px-4 max-lg:pt-1 lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-2 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-4 xl:items-stretch">
              {/* Free */}
              <Card className={`${PLAN_CARD_BASE} border-border/80 bg-card/95 shadow-sm`}>
                <CardHeader className={PLAN_CARD_HEADER}>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-xl">
                    Free
                    <Badge variant="secondary" className="text-base font-bold">
                      0 €
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-pretty text-sm leading-relaxed break-words max-lg:text-[13px] max-lg:leading-snug sm:text-base">
                    <strong className="text-foreground">Para probar en serio</strong>:{" "}
                    {PLAN_INCLUDED_ANALYSES.FREE} análisis/mes con el <strong className="text-foreground">mismo motor</strong>{" "}
                    que los planes de pago. Ideal si publicas poco o quieres validar antes de invertir un euro.
                  </CardDescription>
                </CardHeader>
                <CardContent className={PLAN_CARD_CONTENT}>
                  <div className="row-start-1 shrink-0 space-y-2 lg:row-start-2 lg:border-t lg:border-border/50 lg:pt-4">
                    {!session?.user ? (
                      <div className="flex flex-col justify-end gap-2">
                        <Button asChild className={PRICING_CTA_CLASS} size="lg">
                          <Link href="/register">Registrarse gratis</Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="h-auto min-h-10 w-full whitespace-normal py-2 text-xs text-muted-foreground"
                        >
                          <Link href="/login?callbackUrl=/pricing">Ya tengo cuenta</Link>
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button asChild variant="outline" className={PRICING_CTA_CLASS} size="lg">
                          <Link href="/dashboard">Abrir panel</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="row-start-2 flex min-h-0 flex-col justify-end lg:row-start-1">
                    <PricingPlanFeatureList
                      items={freePlanBullets}
                      summaryHint={`${PLAN_INCLUDED_ANALYSES.FREE} análisis/mes + herramientas`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pro — destacado */}
              <Card
                className={`relative ${PLAN_CARD_BASE} border-2 border-primary/45 bg-gradient-to-b from-primary/[0.06] to-card shadow-xl shadow-primary/15 ring-2 ring-primary/20`}
              >
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
                  <Badge className="gap-1 border border-amber-400/50 bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-amber-950 shadow-md">
                    <Crown className="h-3.5 w-3.5" />
                    Más elegido
                  </Badge>
                </div>
                <CardHeader className={PLAN_CARD_HEADER}>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-xl">
                    Pro
                    <Badge className="bg-primary text-base">{PLAN_PRICING_DISPLAY.PRO.label}</Badge>
                  </CardTitle>
                  <CardDescription className="text-pretty text-sm leading-relaxed break-words max-lg:text-[13px] max-lg:leading-snug sm:text-base">
                    <strong className="text-foreground">{PLAN_INCLUDED_ANALYSES.PRO} análisis/mes</strong> — si los
                    exprimes, cada uno te sale desde <strong className="text-foreground">{proUnit} €</strong>. Pensado
                    para <strong className="text-foreground">vendedores y tiendas</strong> que publican cada semana y
                    notan el coste en horas, no solo en euros.
                  </CardDescription>
                </CardHeader>
                <CardContent className={PLAN_CARD_CONTENT}>
                  <div className="row-start-1 shrink-0 space-y-2 lg:row-start-2 lg:border-t lg:border-border/50 lg:pt-4">
                    {session?.user ? (
                      <div>
                        {commerceEnabled ? (
                          <CheckoutPlanButton plan="PRO" className="shadow-md">
                            Contratar Pro
                          </CheckoutPlanButton>
                        ) : (
                          <Button disabled className={`${PRICING_CTA_CLASS} cursor-not-allowed opacity-90`} size="lg">
                            Contratación no disponible aún
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-end gap-2">
                        {commerceEnabled ? (
                          <>
                            <Button asChild className={`${PRICING_CTA_CLASS} shadow-md`} size="lg">
                              <Link href="/register">
                                Registrarse
                                <span className="block w-full text-[0.85em] font-normal opacity-90">y contratar Pro</span>
                              </Link>
                            </Button>
                            <Button asChild variant="outline" className={PRICING_CTA_CLASS}>
                              <Link href="/login?callbackUrl=/pricing">
                                Iniciar sesión
                                <span className="block w-full text-[0.85em] font-normal opacity-90">y contratar</span>
                              </Link>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button disabled className={`${PRICING_CTA_CLASS} cursor-not-allowed opacity-90`} size="lg">
                              Pro — próximamente
                            </Button>
                            <Button asChild variant="outline" className={PRICING_CTA_CLASS}>
                              <Link href="/register">Crear cuenta gratis (plan Free)</Link>
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="row-start-2 flex min-h-0 flex-col justify-end lg:row-start-1">
                    <PricingPlanFeatureList
                      items={proPlanBullets}
                      summaryHint="Historial completo + SEO Engine + PDFs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pro+ */}
              <Card className={`${PLAN_CARD_BASE} border-primary/30 bg-card/95 shadow-lg`}>
                <CardHeader className={PLAN_CARD_HEADER}>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-xl">
                    Pro+
                    <Badge className="gap-1 bg-primary/90">
                      <Sparkles className="h-3 w-3" />
                      {PLAN_PRICING_DISPLAY.PRO_PLUS.label}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-pretty text-sm leading-relaxed break-words max-lg:text-[13px] max-lg:leading-snug sm:text-base">
                    <strong className="text-foreground">{PLAN_INCLUDED_ANALYSES.PRO_PLUS} análisis/mes</strong> — desde{" "}
                    <strong className="text-foreground">{proPlusUnit} €</strong> por análisis si usas todo el cupo.
                    Para <strong className="text-foreground">agencias y sellers con mucho SKU</strong> que no pueden
                    quedarse sin aire a mitad de mes.
                  </CardDescription>
                </CardHeader>
                <CardContent className={PLAN_CARD_CONTENT}>
                  <div className="row-start-1 shrink-0 space-y-2 lg:row-start-2 lg:border-t lg:border-border/50 lg:pt-4">
                    {session?.user ? (
                      <div>
                        {commerceEnabled ? (
                          <CheckoutPlanButton plan="PRO_PLUS" variant="default">
                            Contratar Pro+
                          </CheckoutPlanButton>
                        ) : (
                          <Button disabled className={`${PRICING_CTA_CLASS} cursor-not-allowed opacity-90`} size="lg">
                            Contratación no disponible aún
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-end gap-2">
                        {commerceEnabled ? (
                          <>
                            <Button asChild className={PRICING_CTA_CLASS} variant="secondary" size="lg">
                              <Link href="/register">
                                Registrarse
                                <span className="block w-full text-[0.85em] font-normal opacity-90">y elegir Pro+</span>
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="h-auto min-h-10 w-full whitespace-normal py-2 text-xs"
                            >
                              <Link href="/login?callbackUrl=/pricing">Ya tengo cuenta</Link>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button disabled className={`${PRICING_CTA_CLASS} cursor-not-allowed opacity-90`} size="lg">
                              Pro+ — próximamente
                            </Button>
                            <Button asChild variant="outline" className={PRICING_CTA_CLASS}>
                              <Link href="/register">Crear cuenta gratis (plan Free)</Link>
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="row-start-2 flex min-h-0 flex-col justify-end lg:row-start-1">
                    <PricingPlanFeatureList
                      items={proPlusPlanBullets}
                      summaryHint="Más cupo + PDF comparativa incluido"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card
                className={`relative ${PLAN_CARD_BASE} overflow-hidden border-2 border-violet-500/35 bg-gradient-to-b from-violet-500/[0.08] via-muted/20 to-card shadow-xl shadow-violet-500/10`}
              >
                <div className="pointer-events-none absolute -right-16 top-0 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />
                <CardHeader className={`relative ${PLAN_CARD_HEADER}`}>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-xl">
                    Enterprise
                    <Badge variant="outline" className="gap-1 border-violet-500/40 bg-violet-500/10 text-violet-950 dark:text-violet-100">
                      <Rocket className="h-3 w-3" />
                      {PLAN_PRICING_DISPLAY.ENTERPRISE.label}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-pretty text-sm leading-relaxed break-words max-lg:text-[13px] max-lg:leading-snug sm:text-base">
                    Para <strong className="text-foreground">equipos y tiendas que viven del catálogo</strong>: un solo
                    precio fijo online (<strong className="text-foreground">100 €/mes</strong>) y{" "}
                    <strong className="text-foreground">cupo ilimitado de créditos</strong> para todo lo que importa en
                    venta — boosts, scans, SEO Engine, informes SERP premium y PDFs — sin estar pendiente del contador
                    cada vez que lanzas campaña o subes 200 SKUs.
                  </CardDescription>
                </CardHeader>
                <CardContent className={`relative ${PLAN_CARD_CONTENT}`}>
                  <div className="row-start-1 shrink-0 space-y-2 lg:row-start-2 lg:border-t lg:border-border/50 lg:pt-4">
                    <div className="flex flex-col justify-end gap-2">
                      {session?.user && enterpriseStripeReady && commerceEnabled ? (
                        <CheckoutPlanButton plan="ENTERPRISE" className="shadow-md">
                          Contratar Enterprise
                        </CheckoutPlanButton>
                      ) : session?.user && enterpriseStripeReady && !commerceEnabled ? (
                        <Button disabled className={`${PRICING_CTA_CLASS} cursor-not-allowed opacity-90`}>
                          Enterprise online — próximamente
                        </Button>
                      ) : !session?.user && commerceEnabled && enterpriseStripeReady ? (
                        <>
                          <Button asChild className={`${PRICING_CTA_CLASS} shadow-md`} size="lg">
                            <Link href="/register">
                              Registrarse
                              <span className="block w-full text-[0.85em] font-normal opacity-90">y contratar Enterprise</span>
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className={PRICING_CTA_CLASS}>
                            <Link href="/login?callbackUrl=/pricing">
                              Iniciar sesión
                              <span className="block w-full text-[0.85em] font-normal opacity-90">y contratar</span>
                            </Link>
                          </Button>
                        </>
                      ) : null}
                      <Button asChild variant="outline" className={PRICING_CTA_CLASS}>
                        <a
                          href={`mailto:${getPublicContactEmail()}?subject=${encodeURIComponent(`Enterprise ${APP_NAME}`)}`}
                        >
                          Pedir propuesta personalizada
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="row-start-2 flex min-h-0 flex-col justify-end lg:row-start-1">
                    <PricingPlanFeatureList
                      items={enterprisePlanBullets}
                      summaryHint="Cupo ilimitado + SERP premium sin cupo"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Qué es un análisis */}
          <section className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border/70 bg-card/80 p-6 sm:p-8">
            <h2 className="text-xl font-bold">¿Qué cuenta como créditos?</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              El cupo mensual y los créditos extra se gastan en <strong className="text-foreground">unidades</strong>: un{" "}
              <strong className="text-foreground">boost de ficha</strong> consume{" "}
              <strong className="text-foreground">{CREDIT_COST_PRODUCT} crédito</strong>; un{" "}
              <strong className="text-foreground">scan SEO de URL</strong> consume{" "}
              <strong className="text-foreground">{CREDIT_COST_URL_AUDIT} créditos</strong> (más intensivo). El informe
              SERP premium (monitoring) cuesta{" "}
              <strong className="text-foreground">{FEATURE_CREDITS.SERP_COMPETITOR_INSIGHT} créditos</strong> en Pro y
              Pro+. En <strong className="text-foreground">Enterprise</strong> el cupo es{" "}
              <strong className="text-foreground">ilimitado</strong>: esas acciones no descuentan. Si te pasas del cupo
              en otros planes, se usan créditos comprados.
              {!commerceEnabled ? (
                <span className="mt-2 block text-sm">
                  <strong className="text-foreground">Ahora:</strong> la compra de créditos extra está desactivada; solo
                  aplica el cupo del plan Free.
                </span>
              ) : null}
            </p>
          </section>

          {/* Créditos */}
          <section className="mx-auto mt-16 max-w-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold">¿Te pasaste del cupo un mes pico?</h2>
              <p className="mt-2 text-muted-foreground">
                Compra <strong className="text-foreground">créditos sueltos</strong> al precio de tu plan. Sin
                cambiar de suscripción si no lo necesitas.
              </p>
            </div>
            <div className="mt-6">
              {session?.user ? (
                commerceEnabled ? (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-muted/20 p-8">
                    <p className="text-center text-sm text-muted-foreground">
                      Precio unitario con tu plan <strong className="text-foreground">{planLabel(userPlan)}</strong>:{" "}
                      <strong className="text-foreground">{EXTRA_CREDIT_PRICE_EUR[userPlan]} €</strong> por crédito.
                      Eliges cuántos quieres y pagas en Stripe.
                    </p>
                    <Button asChild size="lg" className="font-semibold">
                      <Link href="/pricing/credits">Ir a comprar créditos (Stripe)</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/15 px-6 py-8 text-center text-sm text-muted-foreground">
                    <Coins className="mx-auto mb-3 h-10 w-10 opacity-40" />
                    <p>
                      La <strong className="text-foreground">compra de créditos</strong> no está disponible hasta
                      activar pagos. Usa el cupo del plan Free o espera a que habilitemos Stripe.
                    </p>
                  </div>
                )
              ) : (
                <Card className="border-dashed border-primary/30 bg-primary/5">
                  <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                    <Coins className="h-10 w-10 text-primary" />
                    <p className="text-muted-foreground">
                      {commerceEnabled ? (
                        <>
                          Inicia sesión para comprar créditos al instante. Si aún no tienes cuenta,{" "}
                          <Link href="/register" className="font-semibold text-primary hover:underline">
                            créala gratis
                          </Link>{" "}
                          y vuelve aquí.
                        </>
                      ) : (
                        <>
                          <Link href="/register" className="font-semibold text-primary hover:underline">
                            Regístrate gratis
                          </Link>{" "}
                          para el plan Free. La compra de créditos estará disponible próximamente.
                        </>
                      )}
                    </p>
                    {commerceEnabled ? (
                      <Button asChild size="lg">
                        <Link href="/login?callbackUrl=/pricing/credits">Iniciar sesión y comprar créditos</Link>
                      </Button>
                    ) : (
                      <Button asChild size="lg" variant="secondary">
                        <Link href="/register">Crear cuenta gratis</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* CTA banda */}
          {!session?.user ? (
            <div className="mt-16 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/15 via-primary/10 to-accent/10 px-6 py-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">¿Listo para vender más con menos fricción?</h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                Crea tu cuenta en segundos. Prueba Free, mira la calidad del output y cuando quieras, vuelve a esta
                página y contrata Pro en un clic.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button size="lg" className="h-12 gap-2 px-8 shadow-lg" asChild>
                  <Link href="/register">
                    Registrarse gratis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                  <Link href="/producto">Ver qué hace el producto</Link>
                </Button>
              </div>
            </div>
          ) : null}

          {/* FAQ */}
          <section className="mx-auto mt-16 max-w-2xl">
            <h2 className="text-center text-2xl font-bold">Preguntas antes de pagar</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Respuestas claras para decidir sin dudas.
            </p>
            <div
              id="cancelar-plan"
              className="mx-auto mt-8 max-w-xl scroll-mt-24 rounded-xl border border-border/70 bg-muted/25 px-4 py-3 text-center text-sm text-muted-foreground"
            >
              <strong className="text-foreground">¿Baja o cambios?</strong>{" "}
              <span className="leading-relaxed">
                Con cuenta iniciada:{" "}
                <Link href="/settings" className="font-medium text-primary underline-offset-4 hover:underline">
                  Ajustes
                </Link>{" "}
                → «Cancelar o gestionar mi plan». La renovación se detiene al instante;{" "}
                <strong className="text-foreground">el acceso dura hasta el final del periodo ya pagado</strong>.
              </span>
            </div>
            <Accordion type="single" collapsible className="mt-8">
              {pricingFaqs.map((item, i) => (
                <AccordionItem key={i} value={`p-${i}`}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

        </div>
      </div>
    </>
  );
}
