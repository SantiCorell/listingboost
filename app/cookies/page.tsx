import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { LegalDocumentShell } from "@/components/legal/legal-document-shell";
import { ReopenCookiePreferences } from "@/components/legal/reopen-cookie-preferences";
import { CookieSettingsLink } from "@/components/legal/cookie-settings-link";
import { LB_COOKIE_CONSENT_KEY } from "@/lib/legal/cookie-consent-storage";
import { legalContactEmail, legalEntityName, legalSiteUrl } from "@/lib/legal/site-legal";
import Link from "next/link";

const UPDATED = "3 de abril de 2026";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Uso de cookies y almacenamiento local en ${APP_NAME}: necesarias, analíticas, inventario y cómo gestionar el consentimiento.`,
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  const entity = legalEntityName();
  const url = legalSiteUrl();
  const email = legalContactEmail();

  return (
    <LegalDocumentShell title="Política de cookies" updatedLabel={`Última actualización: ${UPDATED}`}>
      <p>
        En <strong>{entity}</strong> utilizamos tecnologías de almacenamiento en tu dispositivo (cookies HTTP y, en su
        caso, almacenamiento del navegador como <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">localStorage</code>)
        para hacer posible el sitio <strong>{APP_NAME}</strong> ({url}) y, <strong>solo con tu consentimiento previo e
        informado</strong>, para una medición agregada de uso. Esta política cumple el deber de información del art. 13
        RGPD en lo que se refiere a dichas tecnologías y se interpreta de acuerdo con la Ley 34/2002 (LSSI) y la normativa
        europea y española en materia de cookies y privacidad, incluidas las guías de la AEPD en la medida aplicable.
      </p>
      <p>
        Al continuar tras el banner, o al guardar preferencias en el panel, aceptas lo indicado para cada categoría. Las
        cookies o almacenamiento <strong>estrictamente necesarios</strong> para prestar el servicio que solicitas quedan
        exceptuadas de consentimiento en los términos legales aplicables.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que el sitio guarda en tu navegador. El almacenamiento local cumple funciones
        similares para datos que la aplicación necesita recordar en tu equipo.
      </p>

      <h2>2. Cookies y almacenamiento estrictamente necesarios</h2>
      <p>
        Son imprescindibles para el funcionamiento del Servicio y no requieren consentimiento previo según la normativa
        de cookies aplicable, en la medida en que permitan la prestación del servicio solicitado:
      </p>
      <ul>
        <li>
          <strong>Sesión e identificación (NextAuth / Auth.js):</strong> cookies HTTP para mantener tu sesión de forma
          segura tras iniciar sesión.
        </li>
        <li>
          <strong>Seguridad y preferencias técnicas:</strong> elementos necesarios para el correcto funcionamiento de
          la aplicación (p. ej. protección CSRF donde aplique).
        </li>
        <li>
          <strong>Almacenamiento local funcional:</strong> colas de trabajos en segundo plano u otros datos ligados al uso
          del producto cuando resulte necesario para la experiencia que solicitas.
        </li>
      </ul>

      <h2>3. Inventario orientativo</h2>
      <p>
        Los nombres exactos de cookies de sesión pueden variar según versión de la aplicación; la finalidad se mantiene.
        Para cualquier duda escríbenos a <a href={`mailto:${email}`}>{email}</a>.
      </p>
      <div className="not-prose my-4 overflow-x-auto rounded-xl border border-border/70 bg-muted/15">
        <table className="w-full min-w-[320px] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="px-3 py-2.5 font-semibold text-foreground">Tecnología / clave</th>
              <th className="px-3 py-2.5 font-semibold text-foreground">Tipo</th>
              <th className="px-3 py-2.5 font-semibold text-foreground">Finalidad</th>
              <th className="px-3 py-2.5 font-semibold text-foreground">Duración orientativa</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="px-3 py-2.5 font-mono text-[11px] text-foreground sm:text-xs">authjs.* / session</td>
              <td className="px-3 py-2.5">Necesaria</td>
              <td className="px-3 py-2.5">Mantener sesión iniciada de forma segura.</td>
              <td className="px-3 py-2.5">Sesión / según configuración</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-3 py-2.5 font-mono text-[11px] text-foreground sm:text-xs">{LB_COOKIE_CONSENT_KEY}</td>
              <td className="px-3 py-2.5">Necesaria (prueba de consentimiento)</td>
              <td className="px-3 py-2.5">Recordar tu elección sobre cookies opcionales.</td>
              <td className="px-3 py-2.5">Persistente hasta que borres datos del sitio</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-3 py-2.5 font-mono text-[11px] text-foreground sm:text-xs">lb_vid</td>
              <td className="px-3 py-2.5">Opcional (analítica propia)</td>
              <td className="px-3 py-2.5">Identificador anónimo local para métricas agregadas de páginas vistas.</td>
              <td className="px-3 py-2.5">Persistente hasta revocación o borrado</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>4. Medición de uso (opcional)</h2>
      <p>
        Si aceptas o activas la categoría correspondiente en el panel, generamos{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">lb_vid</code> en almacenamiento
        local y registramos la ruta visitada de forma agregada. <strong>No vendemos tus datos</strong> ni usamos, en esta
        política, cookies de publicidad de terceros para perfilado comercial.
      </p>

      <h2>5. Cómo damos y retiramos el consentimiento</h2>
      <p>
        La primera vez que visitas el sitio verás un banner con tres opciones de igual facilidad: rechazar lo opcional,
        personalizar categorías o aceptar todas. Puedes abrir de nuevo el panel en cualquier momento desde{" "}
        <CookieSettingsLink className="inline font-medium text-primary" /> en el pie de página o desde el bloque al final
        de esta política.
      </p>
      <p>
        La retirada del consentimiento no afecta a la licitud del tratamiento previo. Puedes también borrar cookies y datos
        del sitio desde tu navegador; desactivar las necesarias puede impedir iniciar sesión.
      </p>

      <h2>6. Cookies de terceros</h2>
      <p>
        Al usar <strong>Stripe Checkout</strong> u otras páginas en dominios de terceros, pueden aplicarse sus propias
        cookies. Revisa la información que Stripe muestra durante el pago y sus políticas.
      </p>

      <h2>7. Cómo gestionar cookies en el navegador</h2>
      <p>
        Puedes bloquear o eliminar cookies desde los ajustes de tu navegador (Chrome, Firefox, Safari, Edge, etc.).
        Desactivar cookies necesarias puede impedir usar partes del Servicio.
      </p>

      <h2>8. Privacidad, términos y contacto</h2>
      <p>
        El tratamiento de datos personales asociado al Servicio se describe en la{" "}
        <Link href="/privacidad">política de privacidad</Link>. Las condiciones de uso del producto están en los{" "}
        <Link href="/terminos">términos de uso</Link>. Para ejercer derechos RGPD o consultas sobre cookies:{" "}
        <a href={`mailto:${email}`}>{email}</a>. Puedes reclamar ante la{" "}
        <a href="https://www.aepd.es">Agencia Española de Protección de Datos (AEPD)</a>.
      </p>

      <ReopenCookiePreferences />
    </LegalDocumentShell>
  );
}
