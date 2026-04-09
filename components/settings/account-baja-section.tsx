import Link from "next/link";
import { getPublicContactEmail } from "@/lib/contact";
import { APP_NAME } from "@/lib/constants";
import { Mail } from "lucide-react";

type Props = {
  /** Si hay cliente en Stripe, conviene cancelar la renovación antes de pedir borrado. */
  hasStripeCustomer: boolean;
  commerceEnabled: boolean;
};

export function AccountBajaSection({ hasStripeCustomer, commerceEnabled }: Props) {
  const email = getPublicContactEmail();
  const mailCloseHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    `Baja de cuenta ${APP_NAME}`,
  )}&body=${encodeURIComponent(
    `Hola,\n\nQuiero cerrar mi cuenta de ${APP_NAME} y solicitar la baja / borrado de mis datos personales asociados.\n\nEmail de la cuenta:\n\nGracias.`,
  )}`;

  return (
    <div id="bajas-y-cuenta" className="scroll-mt-24 border-t border-border/60 pt-6">
      <h2 className="text-base font-semibold text-foreground">Bajas: suscripción y cuenta</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Aquí tienes los dos casos distintos: dejar de pagar no es lo mismo que borrar tu cuenta.
      </p>

      <div className="mt-4 space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
        <div>
          <p className="font-medium text-foreground">1. Cancelar la renovación del plan (dejar de pagar)</p>
          <p className="mt-1 leading-relaxed">
            {commerceEnabled && hasStripeCustomer ? (
              <>
                Usa el botón <strong className="text-foreground">«Cancelar o gestionar mi plan»</strong> de la sección
                anterior. La renovación se para al momento;{" "}
                <strong className="text-foreground">sigues entrando hasta el último día del periodo ya pagado</strong> y no
                se cobra el siguiente ciclo.
              </>
            ) : commerceEnabled ? (
              <>
                Si en el futuro contratas con tarjeta, la baja de la renovación se hará desde el mismo botón de{" "}
                <strong className="text-foreground">gestión de pagos</strong> (aparece cuando exista facturación activa).
              </>
            ) : (
              <>Los pagos están desactivados en este entorno; no hay renovación que cancelar.</>
            )}
          </p>
        </div>
        <div>
          <p className="font-medium text-foreground">2. Cerrar la cuenta y pedir borrar datos</p>
          <p className="mt-1 leading-relaxed">
            No hay un botón automático de borrado: por seguridad lo gestionamos por email. Escríbenos desde{" "}
            <strong className="text-foreground">el mismo correo con el que te registraste</strong> para poder
            identificarte.
          </p>
          <a
            href={mailCloseHref}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            Solicitar baja de cuenta por email
          </a>
          <p className="mt-2 text-xs leading-relaxed">
            Trataremos tu solicitud en un plazo razonable y según la normativa aplicable (incl. protección de datos).
            Más detalle en <Link href="/terminos#duracion-y-baja" className="font-medium text-primary hover:underline">términos · duración y baja</Link> y{" "}
            <Link href="/privacidad" className="font-medium text-primary hover:underline">privacidad</Link>.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preguntas rápidas</p>
        <details className="group rounded-lg border border-border/70 bg-card/50 px-3 py-2">
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
            ¿Cómo cancelo solo el plan y sigo en Free?
          </summary>
          <p className="mt-2 border-t border-border/60 pt-2 text-sm text-muted-foreground leading-relaxed">
            Cancela la renovación con el botón de gestión de pagos. Cuando termine el periodo pagado, tu cuenta pasa a
            seguir existiendo con los límites del plan gratuito (salvo que pidas cerrarla por email).
          </p>
        </details>
        <details className="group rounded-lg border border-border/70 bg-card/50 px-3 py-2">
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
            ¿Cómo cierro la cuenta del todo?
          </summary>
          <p className="mt-2 border-t border-border/60 pt-2 text-sm text-muted-foreground leading-relaxed">
            Usa el enlace de email de arriba. Si tenías plan de pago, conviene cancelar primero la renovación para que no
            haya más cargos; luego pedimos la baja completa.
          </p>
        </details>
        <details className="group rounded-lg border border-border/70 bg-card/50 px-3 py-2">
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
            ¿Pierdo el acceso en cuanto cancelo el pago?
          </summary>
          <p className="mt-2 border-t border-border/60 pt-2 text-sm text-muted-foreground leading-relaxed">
            No. Sigues entrando hasta el final del tiempo que ya pagaste. Después, si no cierras la cuenta, quedas en Free
            con sus límites.
          </p>
        </details>
      </div>
    </div>
  );
}
