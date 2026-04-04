import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Plan, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAuthSecret } from "@/lib/auth-secret";
import { parseAdminEmails } from "@/lib/auth/admin";
import { authConfig, sessionOptions } from "./auth.config";
import { credentialsProvider } from "./lib/auth/credentials-provider";
import { googleProvider } from "./lib/auth/google-provider";

const google = googleProvider();
const providers = google ? [google, credentialsProvider()] : [credentialsProvider()];

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers,
  session: sessionOptions,
  secret: getAuthSecret(),
  callbacks: {
    async signIn({ user }) {
      if (!user?.id || !user.email) return true;
      const allow = parseAdminEmails();
      if (allow.includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user?.id) {
        const row = await prisma.user.findUnique({
          where: { id: user.id },
          select: { plan: true, role: true },
        });
        token.id = user.id;
        token.plan = (row?.plan ?? "FREE") as Plan;
        token.role = (row?.role ?? "USER") as UserRole;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as Plan) ?? "FREE";
        const role = (token.role as UserRole) ?? "USER";
        session.user.role = role;
        session.user.isAdmin =
          role === "ADMIN" || parseAdminEmails().includes((session.user.email ?? "").toLowerCase());
      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            termsAcceptedAt: new Date(),
          },
        });
      }
    },
  },
});
