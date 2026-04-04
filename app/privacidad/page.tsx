import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { LegalDocumentShell } from "@/components/legal/legal-document-shell";
import { legalContactEmail, legalEntityName, legalSiteUrl } from "@/lib/legal/site-legal";
import Link from "next/link";

const UPDATED = "3 de abril de 2026";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Información sobre tratamiento de datos personales en ${APP_NAME}: base legal, derechos RGPD, encargados y conservación.`,
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  const entity = legalEntityName();
  const url = legalSiteUrl();
  const email = legalContactEmail();

  return (
    <LegalDocumentShell title="Política de privacidad" updatedLabel={`Última actualización: ${UPDATED}`}>
      <p>
        El responsable del tratamiento de tus datos personales es <strong>{entity}</strong> (en adelante, «nosotros»),
        en relación con el sitio y el servicio <strong>{APP_NAME}</strong> disponible en{" "}
        <Link href="/">{url}</Link>. Esta política complementa la información que te facilitamos en el momento de la
        recogida de datos y cumple el Reglamento (UE) 2016/679 (RGPD) y la normativa española de protección de datos.
      </p>

      <h2>1. Datos que tratamos</h2>
      <ul>
        <li>
          <strong>Datos de cuenta:</strong> nombre, correo electrónico, tipo de cuenta, datos opcionales de empresa o
          teléfono, credenciales de acceso (contraseña almacenada de forma segura), identificadores de sesión.
        </li>
        <li>
          <strong>Datos de uso:</strong> registros técnicos, historial de uso del Servicio (p. ej. análisis generados),
          datos necesarios para soporte.
        </li>
        <li>
          <strong>Datos de facturación:</strong> identificador de cliente y suscripción en <strong>Stripe</strong>; no
          conservamos el número completo de tu tarjeta en nuestros sistemas.
        </li>
        <li>
          <strong>Contenidos que nos proporcionas</strong> para generar resultados (descripciones, URLs, imágenes si
          aplica).
        </li>
      </ul>

      <h2>2. Finalidades y bases legales</h2>
      <ul>
        <li>
          <strong>Ejecución del contrato</strong> (art. 6.1.b RGPD): crear y mantener tu cuenta, prestar el Servicio,
          procesar pagos a través de Stripe.
        </li>
        <li>
          <strong>Interés legítimo</strong> (art. 6.1.f RGPD): seguridad, prevención de abuso, mejora del producto y
          métricas agregadas, siempre respetando tus derechos y la normativa.
        </li>
        <li>
          <strong>Consentimiento</strong> (art. 6.1.a RGPD): cuando activemos cookies o herramientas de medición no
          estrictamente necesarias, según lo indicado en la{" "}
          <Link href="/cookies">política de cookies</Link>.
        </li>
        <li>
          <strong>Obligación legal</strong> (art. 6.1.c RGPD): cuando debamos cumplir requerimientos administrativos o
          judiciales.
        </li>
      </ul>

      <h2>3. Conservación</h2>
      <p>
        Conservamos los datos el tiempo necesario para las finalidades indicadas y para atender posibles
        responsabilidades legales. Los datos de cuenta inactiva pueden eliminarse o anonimizarse tras un periodo
        razonable, salvo obligación de retención (p. ej. facturación).
      </p>

      <h2>4. Destinatarios y encargados</h2>
      <p>
        Podemos comunicar datos a proveedores que actúan como <strong>encargados del tratamiento</strong> bajo contrato
        y medidas de seguridad adecuadas, entre otros:
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> (pagos y suscripciones), según su política de privacidad.
        </li>
        <li>
          <strong>Proveedores de infraestructura y alojamiento</strong> (p. ej. base de datos, despliegue de la
          aplicación).
        </li>
        <li>
          <strong>Proveedores de modelos de IA</strong> cuando sea necesario para ejecutar las funciones del Servicio,
          con salvaguardas contractuales.
        </li>
      </ul>
      <p>
        No vendemos tus datos personales. Las transferencias internacionales, si las hubiera, se basarán en cláusulas
        contractuales tipo u otros mecanismos aprobados por la Comisión Europea.
      </p>

      <h2>5. Tus derechos</h2>
      <p>Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y
        portabilidad, así como retirar el consentimiento cuando el tratamiento se base en él, escribiendo a{" "}
        <a href={`mailto:${email}`}>{email}</a>, acreditando tu identidad. También puedes reclamar ante la{" "}
        <strong>Agencia Española de Protección de Datos (AEPD)</strong> (<a href="https://www.aepd.es">www.aepd.es</a>).
      </p>

      <h2>6. Menores</h2>
      <p>
        El Servicio no está dirigido a menores de 16 años. Si detectamos datos de menores sin base válida, procederemos
        a su eliminación.
      </p>

      <h2>7. Cambios</h2>
      <p>
        Podemos actualizar esta política. Publicaremos la versión vigente en esta página con la fecha de actualización.
        Te recomendamos revisarla periódicamente.
      </p>
    </LegalDocumentShell>
  );
}
