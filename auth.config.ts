import type { NextAuthConfig } from "next-auth";

/** Opciones de sesión compartidas entre runtime Node (API) y Edge (middleware). */
export const sessionOptions = {
  strategy: "jwt" as const,
  maxAge: 30 * 24 * 60 * 60,
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
