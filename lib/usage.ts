import { prisma } from "@/lib/prisma";
import type { Plan, User, UserRole } from "@prisma/client";
import { FREE_HISTORY_LIMIT } from "@/lib/constants";
import { isCommerceEnabled } from "@/lib/commerce";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { isPaidPlan, monthlyIncludedLimit } from "@/lib/plans";
import { userIsAdmin } from "@/lib/auth/admin";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Créditos de cupo que consume un boost de ficha. */
export const CREDIT_COST_PRODUCT = 1;

/** Créditos de cupo que consume un scan SEO de URL (más coste de cómputo). */
export const CREDIT_COST_URL_AUDIT = 2;

export function creditCostForUsageKind(kind: string): number {
  if (kind === "url_audit") return CREDIT_COST_URL_AUDIT;
  if (kind === "url_audit_pdf") return 1;
  if (kind === "seo_quick_fix") return FEATURE_CREDITS.SEO_QUICK_FIX;
  if (kind === "seo_content") return FEATURE_CREDITS.SEO_CONTENT_BLOG;
  if (kind === "seo_content_product") return FEATURE_CREDITS.SEO_CONTENT_PRODUCT;
  if (kind === "blog_optimize") return FEATURE_CREDITS.BLOG_OPTIMIZE;
  if (kind === "competitor_compare") return FEATURE_CREDITS.COMPETITOR_COMPARE;
  if (kind === "competitor_compare_pdf") return FEATURE_CREDITS.COMPETITOR_PDF_EXPORT;
  return CREDIT_COST_PRODUCT;
}

export async function resetMonthlyUsageIfNeeded(user: User): Promise<User> {
  const start = startOfMonth(new Date());
  if (user.monthResetAt < start) {
    return prisma.user.update({
      where: { id: user.id },
      data: {
        analysesThisMonth: 0,
        monthResetAt: start,
      },
    });
  }
  return user;
}

/** @deprecated use monthlyIncludedLimit from lib/plans */
export function monthlyLimit(plan: Plan): number {
  return monthlyIncludedLimit(plan);
}

/**
 * Comprueba si el usuario puede gastar `creditCost` unidades del cupo mensual + créditos extra.
 * `analysesThisMonth` acumula unidades de cupo (boost = 1, scan URL = 2).
 */
export async function assertCanAnalyze(userId: string, creditCost = CREDIT_COST_PRODUCT): Promise<User> {
  let user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  user = await resetMonthlyUsageIfNeeded(user);
  if (userIsAdmin(user.role, user.email)) {
    return user;
  }
  const cap = monthlyIncludedLimit(user.plan);
  const includedLeft = Math.max(0, cap - user.analysesThisMonth);
  const totalAvailable = includedLeft + user.bonusCreditsRemaining;
  if (totalAvailable < creditCost) {
    const commerce = isCommerceEnabled();
    if (user.plan === "FREE") {
      if (creditCost >= CREDIT_COST_URL_AUDIT) {
        throw new Error(
          commerce
            ? `Necesitas ${creditCost} créditos para un scan URL y solo tienes ${totalAvailable}. Compra más en Precios → créditos o mejora el plan.`
            : `Necesitas ${creditCost} créditos para un scan URL y solo tienes ${totalAvailable}. Pronto podrás comprar créditos; de momento usa el cupo mensual del plan Free.`,
        );
      }
      throw new Error(
        commerce
          ? `Has agotado los ${cap} créditos incluidos del plan Free (o no te alcanza el cupo). Compra créditos en Precios o pásate a Pro.`
          : `Has agotado los ${cap} créditos incluidos del plan Free (o no te alcanza el cupo). La compra de créditos y los planes de pago estarán disponibles próximamente.`,
      );
    }
    throw new Error(
      commerce
        ? "Has agotado tu cupo mensual y créditos extra. Compra créditos o cambia de plan en Precios."
        : "Has agotado tu cupo mensual y créditos extra. La recarga con tarjeta estará disponible cuando activemos pagos.",
    );
  }
  return user;
}

export async function recordAnalysisUsage(userId: string, kind: string, creditCostOverride?: number) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (userIsAdmin(user.role, user.email)) {
    return;
  }
  const cost = creditCostOverride ?? creditCostForUsageKind(kind);
  const cap = monthlyIncludedLimit(user.plan);
  const includedLeft = Math.max(0, cap - user.analysesThisMonth);
  const fromBundle = Math.min(cost, includedLeft);
  const fromBonus = cost - fromBundle;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        analysesThisMonth: { increment: fromBundle },
        bonusCreditsRemaining: { decrement: fromBonus },
      },
    }),
    prisma.usageEvent.create({
      data: {
        userId,
        kind,
        meta: { fromBundle, fromBonus, creditCost: cost },
      },
    }),
  ]);
}

export function historyTake(
  plan: Plan,
  role?: UserRole | null,
  email?: string | null,
): number | undefined {
  if (userIsAdmin(role, email)) return undefined;
  if (isPaidPlan(plan)) return undefined;
  return FREE_HISTORY_LIMIT;
}
