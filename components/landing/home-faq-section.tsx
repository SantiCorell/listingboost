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
          <AccordionTrigger>¿Tarjeta en el tier free?</AccordionTrigger>
          <AccordionContent>
            No. Registro → cupos mensuales claros → upgrade a Pro cuando quieras más análisis, sin marca de agua y con
            historial completo.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>¿Los hashtags funcionan en redes?</AccordionTrigger>
          <AccordionContent>
            Sí: generamos etiquetas con # listas para copiar. Puedes pegar la línea completa en Instagram o TikTok;
            también puedes copiar tag a tag.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger>¿Soporta imágenes de producto?</AccordionTrigger>
          <AccordionContent>
            Sí. El pipeline incorpora visión cuando el despliegue lo permite; el texto sigue siendo suficiente para una
            ficha sólida.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="4">
          <AccordionTrigger>¿Por qué {APP_NAME}?</AccordionTrigger>
          <AccordionContent>
            Porque une scoring verificable con recomendaciones accionables vía {ENGINE_NAME} — pensado para que inviertas
            menos tiempo y captures más valor por listing.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="5">
          <AccordionTrigger>¿Sois herramienta SEO o panel de redes / “comprar likes”?</AccordionTrigger>
          <AccordionContent>
            Somos <strong className="text-foreground">software SaaS de SEO y listings</strong>: auditoría de URLs,
            lectura de resultados en Google, seguimiento de posiciones y texto de anuncios. No vendemos seguidores, likes,
            reproducciones
            ni reseñas; los hashtags son sugerencias en texto (#) para que tú publiques. “Boost de ficha” = mejorar el
            copy del anuncio, no inflar métricas.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="6">
          <AccordionTrigger>¿Garantizáis subir en Google o en Wallapop?</AccordionTrigger>
          <AccordionContent>
            No garantizamos posiciones ni ventas. Te damos datos y textos accionables; tú publicas cumpliendo las normas
            de cada plataforma.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          size="lg"
          className="h-12 border border-primary/20 bg-gradient-to-r from-primary to-primary/88 px-8 shadow-lg shadow-primary/20"
        >
          <Link href="/register">Registrarse</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 border-border/80 px-8">
          <Link href="/login">Iniciar sesión</Link>
        </Button>
      </div>
    </div>
  );
}
