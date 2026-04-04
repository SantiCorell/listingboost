import type { DefaultSession } from "next-auth";
import type { Plan, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      plan: Plan;
      role: UserRole;
      isAdmin: boolean;
    };
  }

  interface User {
    id?: string;
    /** Presente en login por credenciales; en OAuth se rellena vía JWT desde la base de datos. */
    plan?: Plan;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    plan?: Plan;
    role?: UserRole;
  }
}
