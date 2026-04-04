/**
 * Supabase API (REST / Realtime / Storage) — distinto de Prisma/Postgres directo.
 * - Prisma + Auth.js siguen usando DATABASE_URL (cadena PostgreSQL).
 * - Estas claves sirven para @supabase/supabase-js cuando quieras usar la API de Supabase.
 */
export { getSupabaseServiceRole } from "./admin";
export { createSupabaseBrowserClient } from "./browser-client";
export { getSupabaseBrowserPublicKey } from "./public-key";
