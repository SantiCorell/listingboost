"use server";

import { auth } from "@/auth";
import type { AccountKind, AccountProfile } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(80).trim(),
  companyName: z
    .string()
    .max(120)
    .optional()
    .transform((s) => {
      const t = s?.trim();
      return t ? t : undefined;
    }),
  phone: z
    .string()
    .max(40)
    .optional()
    .transform((s) => {
      const t = s?.trim();
      return t ? t : undefined;
    }),
  accountKind: z
    .union([z.enum(["EMPRESA", "AUTONOMO", "PARTICULAR"]), z.literal(""), z.null()])
    .optional()
    .transform((v): AccountKind | null => (v === "" || v === undefined || v === null ? null : v)),
  profileType: z
    .union([
      z.enum(["MARKETPLACE_SELLER", "ECOMMERCE_BRAND", "AGENCY_FREELANCER", "OTHER"]),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((v): AccountProfile | null => (v === "" || v === undefined || v === null ? null : v)),
});

export type UpdateProfileState = { ok: true } | { ok: false; error: string };

export async function updateProfile(_prev: UpdateProfileState | undefined, formData: FormData): Promise<UpdateProfileState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Sesión no válida." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    companyName: formData.get("companyName") ?? "",
    phone: formData.get("phone") ?? "",
    accountKind: formData.get("accountKind"),
    profileType: formData.get("profileType"),
  });

  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors.name?.[0] ?? "Datos no válidos.";
    return { ok: false, error: msg };
  }

  const { name, companyName, phone, accountKind, profileType } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      companyName: companyName ?? null,
      phone: phone ?? null,
      accountKind,
      profileType,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
