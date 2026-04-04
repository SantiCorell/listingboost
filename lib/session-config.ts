/**
 * Caducidad de sesión (JWT + cookie). Cada petición que valida la sesión renueva
 * la ventana: si no hay actividad durante este tiempo, hay que volver a entrar.
 * Opcional: AUTH_SESSION_MAX_AGE_SECONDS en .env (mínimo 120, máximo 86400).
 */
export function getSessionMaxAgeSeconds(): number {
  const raw = process.env.AUTH_SESSION_MAX_AGE_SECONDS?.trim();
  if (!raw) return 15 * 60;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return 15 * 60;
  return Math.min(Math.max(n, 120), 24 * 60 * 60);
}

export function getSessionIdleMinutesRounded(): number {
  return Math.max(1, Math.round(getSessionMaxAgeSeconds() / 60));
}
