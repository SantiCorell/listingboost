/** True si hay credenciales de Google configuradas (servidor). */
export function isGoogleAuthConfigured(): boolean {
  const id = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
  return Boolean(id?.trim() && secret?.trim());
}
