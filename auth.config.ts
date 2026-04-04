import type { NextAuthConfig } from "next-auth";
import { getSessionMaxAgeSeconds } from "@/lib/session-config";

const maxAge = getSessionMaxAgeSeconds();

/** Opciones de sesión compartidas entre runtime Node (API) y Edge (middleware). */
export const sessionOptions = {
  strategy: "jwt" as const,
  /** Inactividad: tras este tiempo sin peticiones válidas la sesión expira. Cada uso renueva el reloj. */
  maxAge,
  /** Solo afecta a sesiones en base de datos; con JWT el core reemite el token en cada lectura de sesión. */
  updateAge: 60,
};

/**
 * Fragmento Edge-safe: sin callbacks que usen DB (el JWT completo se firma en `auth.ts`).
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [],
} satisfies NextAuthConfig;
