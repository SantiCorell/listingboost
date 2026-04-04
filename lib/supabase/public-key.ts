/**
 * Clave pública para createClient en el navegador:
 * - Preferencia: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (sb_publishable_…)
 * - Compatibilidad: NEXT_PUBLIC_SUPABASE_ANON_KEY (JWT anon legado)
 */
export function getSupabaseBrowserPublicKey(): string | undefined {
  const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return pub || anon || undefined;
}
