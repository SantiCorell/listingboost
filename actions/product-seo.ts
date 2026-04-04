"use server";

import { auth } from "@/auth";
import {
  executeProductSeoForUser,
  productSeoInputSchema,
} from "@/lib/product-seo-executor";

export type ProductSeoActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; analysisId: string; output: unknown };

export async function runProductSeoAnalysis(
  payload: unknown,
): Promise<ProductSeoActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "error", message: "Debes iniciar sesión." };
  }

  const parsed = productSeoInputSchema.safeParse(payload);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos del formulario." };
  }

  const res = await executeProductSeoForUser(session.user.id, parsed.data);
  if (!res.ok) {
    return { status: "error", message: res.message };
  }
  return {
    status: "success",
    analysisId: res.analysisId,
    output: res.output,
  };
}
