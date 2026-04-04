/**
 * Secreto para firmar JWT/cookies (Auth.js).
 * En desarrollo, si falta AUTH_SECRET, usamos un valor local para que OAuth y sesión funcionen.
 * En producción en runtime es obligatorio AUTH_SECRET (o NEXTAUTH_SECRET).
 *
 * Durante `next build` (p. ej. Vercel) Next define NEXT_PHASE=phase-production-build; ahí
 * usamos un placeholder solo para compilar. Sin variable en el host, las rutas que usen Auth
 * fallarán al ejecutarse — hay que definir AUTH_SECRET en el panel de Vercel (Build + Runtime).
 */
const BUILD_PLACEHOLDER =
  "__listingboost_build_only_placeholder_define_auth_secret_in_vercel__";

export function getAuthSecret(): string {
  const fromEnv =
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim();
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === "development") {
    if (typeof console !== "undefined") {
      console.warn(
        "[auth] AUTH_SECRET no está definido. Usando secreto de solo-desarrollo. " +
          "Añade AUTH_SECRET en .env.local antes de producción.",
      );
    }
    return "__listingboost_dev_secret_change_in_env_local__";
  }

  if (process.env.NEXT_PHASE === "phase-production-build") {
    return BUILD_PLACEHOLDER;
  }

  if (process.env.SKIP_ENV_VALIDATION === "1") {
    return BUILD_PLACEHOLDER;
  }

  /**
   * Vercel: sin AUTH_SECRET, importar `auth.ts` lanza y toda la app devuelve 500.
   * Fallback solo con env (compatible con Edge middleware): usa IDs de despliegue de Vercel.
   * Añade AUTH_SECRET en el panel (openssl rand -base64 32) para producción seria.
   */
  if (process.env.VERCEL === "1" || process.env.VERCEL_ENV) {
    const dpl = process.env.VERCEL_DEPLOYMENT_ID?.trim();
    const url = process.env.VERCEL_URL?.trim();
    const sha = process.env.VERCEL_GIT_COMMIT_SHA?.trim();
    console.error(
      "[auth] AUTH_SECRET / NEXTAUTH_SECRET no definido en Vercel. " +
        "Añade AUTH_SECRET en Environment Variables (Production). " +
        "Mientras tanto se usa un secreto por despliegue.",
    );
    return `__lb_vercel__${dpl ?? "dpl"}__${url ?? "host"}__${sha ?? "sha"}`;
  }

  throw new Error(
    "AUTH_SECRET (o NEXTAUTH_SECRET) es obligatorio en producción. En Vercel: Project → Settings → Environment Variables → añade AUTH_SECRET para Production (y que esté disponible en Build). Consulta .env.example",
  );
}
