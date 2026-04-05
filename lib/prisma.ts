import { PrismaClient } from "@prisma/client";

/**
 * Un solo PrismaClient por proceso (obligatorio en serverless / Vercel).
 * Antes solo se guardaba en global en desarrollo → en prod cada recarga del módulo
 * podía crear otro cliente y agotar el pool de Supabase (MaxClientsInSessionMode).
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

globalForPrisma.prisma = prisma;
