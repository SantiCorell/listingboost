/**
 * Secreto para firmar JWT/cookies (Auth.js).
 * En desarrollo, si falta AUTH_SECRET, usamos un valor local para que OAuth y sesión funcionen.
 * En producción es obligatorio definir AUTH_SECRET (o NEXTAUTH_SECRET).
 */
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

  throw new Error(
    "AUTH_SECRET (o NEXTAUTH_SECRET) es obligatorio en producción. Consulta .env.example",
  );
}
