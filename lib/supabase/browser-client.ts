"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserPublicKey } from "./public-key";

/** Cliente público (publishable o anon JWT): solo en el navegador; respeta RLS. */
export function createSupabaseBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabaseBrowserPublicKey();
  if (!url?.trim() || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (o NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  }
  return createClient(url, key);
}
