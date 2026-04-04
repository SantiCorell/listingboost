import type { Plan } from "@prisma/client";
import { isPaidPlan } from "@/lib/plans";
import { userIsAdmin } from "@/lib/auth/admin";
import type { UserRole } from "@prisma/client";

/** Plan Free: lista en historial pero no abre el estudio guardado. Admin siempre puede (soporte). */
export function canOpenSavedStudy(
  plan: Plan,
  role: UserRole | null | undefined,
  email: string | null | undefined,
): boolean {
  if (userIsAdmin(role, email)) return true;
  return isPaidPlan(plan);
}
