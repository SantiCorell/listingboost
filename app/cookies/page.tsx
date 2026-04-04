import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { LegalDocumentShell } from "@/components/legal/legal-document-shell";
import { ReopenCookiePreferences } from "@/components/legal/reopen-cookie-preferences";
import { legalContactEmail, legalEntityName, legalSiteUrl } from "@/lib/legal/site-legal";
import Link from "next/link";

const UPDATED = "3 de abril de 2026";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Uso de cookies y almacenamiento local en ${APP_NAME}: necesarias, analíticas y cómo configurarlas.`,
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  const entity = legalEntityName();
  const url = legalSiteUrl();
  const email = legalContactEmail();

  return (
    <LegalDocumentShell title="Política de cookies" updatedLabel={`Última actualización: ${UPDATED}`}>
      <p>
        En <strong>{entity}</strong> utilizamos tecnologías de almacenamiento en tu dispositivo (cookies y almacenamiento
        del navegador) para hacer posible el sitio <strong>{APP_NAME}</strong> ({url}) y, con tu consentimiento, para
        entender de forma agregada cómo se usa. Esta política explica qué usamos y cómo puedes gestionarlo.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que el sitio guarda en tu navegador. El «almacenamiento local» (p. ej.{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">localStorage</code>) cumple
        funciones similares para datos que la aplicación necesita recordar en tu equipo.
      </p>

      <h2>2. Cookies y almacenamiento estrictamente necesarios</h2>
      <p>
        Son imprescindibles para el funcionamiento del Servicio y no requieren consentimiento según la normativa de
        cookies aplicable (directiva ePrivacy y guías AEPD), en la medida en que permitan la prestación del servicio
        solicitado:
      </p>
      <ul>
        <li>
          <strong>Sesión e identificación (NextAuth / Auth.js):</strong> cookies HTTP para mantener tu sesión de forma
          segura tras iniciar sesión.
        </li>
        <li>
          <strong>Seguridad y preferencias técnicas:</strong> elementos necesarios para el correcto funcionamiento de la
          aplicación.
        </li>
        <li>
          <strong>Almacenamiento local funcional:</strong> por ejemplo, colas de trabajos en segundo plano ligadas a tu
          sesión de uso del producto, cuando resulte necesario para la experiencia que solicitas.
        </li>
      </ul>

      <h2>3. Medición de uso (opcional)</h2>
      <p>
        Si aceptas en el banner de cookies, generamos un identificador anónimo almacenado localmente (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">lb_vid</code>) y enviamos al
        servidor la ruta de página visitada de forma agregada para mejorar el producto.{" "}
        <strong>No usamos cookies de publicidad de terceros</strong> con fines de perfilado comercial en esta política.
      </p>
      <p>
        Puedes retirar tu consentimiento en cualquier momento borrando los datos del sitio desde la configuración de tu
        navegador o, cuando lo ofrezcamos, volviendo a mostrar opciones equivalentes al banner inicial (elimina la clave
        de consentimiento en almacenamiento local y recarga la página).
      </p>

      <h2>4. Cookies de terceros</h2>
      <p>
        Al usar <strong>Stripe Checkout</strong> u otras páginas alojadas en dominios de terceros, pueden aplicarse las
        políticas de cookies de esos proveedores. Te recomendamos revisar la información que Stripe muestra durante el
        pago.
      </p>

      <h2>5. Cómo gestionar cookies en el navegador</h2>
      <p>
        Puedes bloquear o eliminar cookies desde los ajustes de tu navegador (Chrome, Firefox, Safari, Edge, etc.).
        Tener en cuenta que desactivar cookies necesarias puede impedir iniciar sesión o usar partes del Servicio.
      </p>

      <h2>6. Más información</h2>
      <p>
        Para el tratamiento de datos personales asociado al Servicio, consulta la{" "}
        <Link href="/privacidad">política de privacidad</Link>. Para dudas:{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <ReopenCookiePreferences />
    </LegalDocumentShell>
  );
}
