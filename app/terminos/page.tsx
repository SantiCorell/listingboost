import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { LegalDocumentShell } from "@/components/legal/legal-document-shell";
import { legalContactEmail, legalEntityName, legalSiteUrl } from "@/lib/legal/site-legal";
import Link from "next/link";

const UPDATED = "3 de abril de 2026";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: `Condiciones generales de uso de ${APP_NAME}: servicio SaaS, planes, pagos con Stripe y responsabilidades del usuario.`,
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  const entity = legalEntityName();
  const url = legalSiteUrl();
  const email = legalContactEmail();

  return (
    <LegalDocumentShell title="Términos de uso" updatedLabel={`Última actualización: ${UPDATED}`}>
      <p>
        Los presentes términos regulan el acceso y uso del sitio web y del servicio en línea{" "}
        <strong>{APP_NAME}</strong> (en adelante, el «Servicio»), ofrecido por{" "}
        <strong>{entity}</strong> (en adelante, «nosotros» o el «Titular»). Al registrarte, contratar un plan o
        utilizar el Servicio, declaras haber leído y aceptado estas condiciones. Si no estás de acuerdo, no uses el
        Servicio.
      </p>

      <h2>1. Descripción del Servicio</h2>
      <p>
        {APP_NAME} es una herramienta de software que facilita la generación y optimización de contenidos para
        anuncios y fichas de producto en marketplaces y canales digitales, así como análisis orientativos de URLs y
        contenidos para redes sociales, mediante tecnologías que incluyen el motor <strong>{ENGINE_NAME}</strong>. El
        Servicio se presta «en el estado en que se encuentra» y puede evolucionar: funcionalidades, límites de uso y
        planes pueden modificarse con razonable antelación o comunicación en el producto cuando proceda.
      </p>

      <h2>2. Registro y cuenta</h2>
      <ul>
        <li>Debes proporcionar datos veraces y mantener la confidencialidad de tus credenciales.</li>
        <li>Eres responsable de toda actividad realizada con tu cuenta.</li>
        <li>
          Podemos suspender o cancelar cuentas ante uso abusivo, fraude, incumplimiento de estos términos o requerimiento
          legal.
        </li>
      </ul>

      <h2>3. Planes, precios y pagos</h2>
      <ul>
        <li>
          Los planes de pago se contratan como <strong>suscripciones recurrentes</strong> procesadas por{" "}
          <strong>Stripe</strong>, salvo que se indique expresamente lo contrario. La renovación es{" "}
          <strong>automática en cada periodo de facturación</strong> (p. ej. mensual) hasta que canceles según las
          opciones disponibles en el portal de facturación de Stripe o en tu cuenta.
        </li>
        <li>
          Los <strong>créditos o análisis adicionales</strong> que puedas comprar constituyen pagos independientes
          (normalmente de pago único) según lo mostrado en el checkout.
        </li>
        <li>Los precios vigentes son los publicados en el momento de la contratación, impuestos incluidos si aplica.</li>
        <li>
          El Titular no almacena el número completo de tu tarjeta; el tratamiento de datos de pago corresponde a Stripe
          como proveedor de pagos.
        </li>
      </ul>

      <h2>4. Uso aceptable</h2>
      <p>Te comprometes a no utilizar el Servicio para:</p>
      <ul>
        <li>Generar contenido ilegal, engañoso, difamatorio o que vulnere derechos de terceros.</li>
        <li>Intentar eludir límites técnicos, realizar ingeniería inversa desproporcionada o saturar la infraestructura.</li>
        <li>Revender el acceso al Servicio sin autorización expresa por escrito.</li>
      </ul>

      <h2>5. Propiedad intelectual y contenidos del usuario</h2>
      <p>
        Los textos, diseños, marcas y software de {APP_NAME} son titularidad del Titular o de sus licenciantes. Los
        contenidos que introduzcas o generes para tu propio negocio te pertenecen en la medida en que ostentes los
        derechos sobre tus datos de partida; no obstante, nos concedes una licencia limitada, no exclusiva y mundial
        para alojar, procesar y mostrar dichos contenidos únicamente con la finalidad de prestar el Servicio.
      </p>

      <h2>6. Resultados generados por IA</h2>
      <p>
        Los resultados son <strong>orientativos</strong> y pueden contener imprecisiones. Debes revisarlos antes de
        publicarlos. No garantizamos posicionamiento en buscadores, conversiones ni cumplimiento de políticas de
        terceros (marketplaces, redes sociales, etc.).
      </p>

      <h2>7. Privacidad, cookies y comunicaciones</h2>
      <p>
        El tratamiento de tus datos personales se rige por la <Link href="/privacidad">política de privacidad</Link>. El
        uso de cookies y tecnologías similares se describe en la <Link href="/cookies">política de cookies</Link>,
        incluido el mecanismo de consentimiento (banner y panel de preferencias). Al usar el Servicio tras dicho
        mecanismo, confirmas haber sido informado y, en su caso, haber consentido conforme a la normativa aplicable.
      </p>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley aplicable, el Titular no será responsable de daños indirectos, lucro
        cesante, pérdida de datos o interrupciones del Servicio. La responsabilidad total acumulada por el Titular en
        relación con el Servicio en un periodo de doce meses no superará, en conjunto, el importe que hayas abonado por
        el Servicio en los doce meses anteriores al hecho causante, salvo en casos de dolo o negligencia grave.
      </p>

      <h2>9. Duración y baja</h2>
      <p>
        Puedes dejar de usar el Servicio en cualquier momento. Las suscripciones activas se rigen por las condiciones de
        facturación de Stripe y por lo acordado en el checkout. La baja puede no suponer reembolso de periodos ya
        iniciados, salvo derecho legal imperativo.
      </p>

      <h2>10. Legislación y jurisdicción</h2>
      <p>
        Estos términos se rigen por la legislación de <strong>España</strong>. Para consumidores residentes en la UE se
        respetan los derechos imperativos que les correspondan. Para la resolución de controversias, los tribunales del
        domicilio del consumidor o los que correspondan según normativa aplicable podrán resultar competentes.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Para consultas sobre estos términos: <a href={`mailto:${email}`}>{email}</a>. Sitio web:{" "}
        <Link href="/">{url}</Link>.
      </p>
    </LegalDocumentShell>
  );
}
