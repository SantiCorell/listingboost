import Link from "next/link";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** FAQ de la home — chunk separado para reducir JS inicial en la ruta `/`. */
export function HomeFaqSection() {
  return (
    <div id="faq" className="mx-auto mt-24 max-w-3xl scroll-mt-24 text-center">
      <h2 className="text-2xl font-bold">FAQ</h2>
      <Accordion type="single" collapsible className="mt-6 w-full text-left">
        <AccordionItem value="1">
          <AccordionTrigger>¿Es una SEO tool para Google y para IA (ChatGPT)?</AccordionTrigger>
          <AccordionContent>
            Sí. {APP_NAME} cubre auditoría on-page, huecos competitivos desde Google, seguimiento de posiciones y textos
            con {ENGINE_NAME} pensados también para{" "}
            <strong className="text-foreground">answer engine optimization</strong>: contenido claro que ayuda a
            buscadores y a asistentes a entender tu oferta.{" "}
            <Link href="/appear-in-chatgpt" className="font-medium text-primary hover:underline">
              Más sobre aparecer en ChatGPT
            </Link>
            .
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>¿Tarjeta en el tier free?</AccordionTrigger>
          <AccordionContent>
            No. Registro → cupos mensuales claros → upgrade a Pro cuando quieras más análisis, sin marca de agua y con
            historial completo.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger>¿Qué incluye la auditoría URL gratis?</AccordionTrigger>
          <AccordionContent>
            Una primera pasada con puntuación y prioridades para mejorar SEO on-page en una URL pública. Es el mejor
            punto de entrada si buscas una <strong className="text-foreground">seo audit tool</strong> rápida.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="4">
          <AccordionTrigger>¿Sois alternativa a Semrush o Ahrefs?</AccordionTrigger>
          <AccordionContent>
            Somos complementarios: las suites grandes mandan en datos masivos; nosotros en{" "}
            <strong className="text-foreground">pasar del informe a la publicación</strong> con IA y checklists
            accionables. Lee la{" "}
            <Link href="/mejores-herramientas-seo-2026" className="font-medium text-primary hover:underline">
              comparativa de herramientas SEO 2026
            </Link>
            .
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="5">
          <AccordionTrigger>¿Garantizáis posiciones en Google o menciones en ChatGPT?</AccordionTrigger>
          <AccordionContent>
            No garantizamos rankings ni citas en terceros. Te damos datos y textos accionables; tú publicas cumpliendo las
            normas de cada plataforma.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="6">
          <AccordionTrigger>¿También sirve para anuncios en marketplaces?</AccordionTrigger>
          <AccordionContent>
            Sí, como capa opcional: boost de ficha y hashtags para Wallapop, eBay, Shopify y similares. El núcleo del
            producto es <strong className="text-foreground">SEO web + AEO</strong>; el multicanal acelera si ya vendes ahí.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          size="lg"
          className="h-12 border border-primary/20 bg-gradient-to-r from-primary to-primary/88 px-8 shadow-lg shadow-primary/20"
        >
          <Link href="/register?callbackUrl=/dashboard/audit">Analizar mi web gratis</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 border-border/80 px-8">
          <Link href="/login">Iniciar sesión</Link>
        </Button>
      </div>
    </div>
  );
}
