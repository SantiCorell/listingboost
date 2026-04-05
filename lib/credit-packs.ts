import type { Plan } from "@prisma/client";
import { extraCreditUnitAmountCents } from "@/lib/plans";

/** Packs con descuento solo para plan FREE (precio unitario de lista = extraCreditUnitAmountCents(FREE)). */
export type FreeCreditPackId = "free_25" | "free_50" | "free_100";

export type FreeCreditPack = {
  id: FreeCreditPackId;
  credits: number;
  /** Total cobrado en Stripe (céntimos) */
  totalCents: number;
  /** Precio de lista sin pack (credits × 1 € en Free) */
  listTotalCents: number;
  label: string;
  /** Redondeado para badge UI */
  discountPercent: number;
  shortHint: string;
};

function listUnitCentsFree(): number {
  return extraCreditUnitAmountCents("FREE");
}

export function freeCreditPacks(): FreeCreditPack[] {
  const list = listUnitCentsFree();
  const packs: Omit<FreeCreditPack, "discountPercent">[] = [
    {
      id: "free_25",
      credits: 25,
      totalCents: 1900,
      listTotalCents: 25 * list,
      label: "Pack 25 créditos",
      shortHint: "Para varios análisis puntuales",
    },
    {
      id: "free_50",
      credits: 50,
      totalCents: 3500,
      listTotalCents: 50 * list,
      label: "Pack 50 créditos",
      shortHint: "Mejor relación calidad-precio",
    },
    {
      id: "free_100",
      credits: 100,
      totalCents: 6500,
      listTotalCents: 100 * list,
      label: "Pack 100 créditos",
      shortHint: "Volumen y equipos",
    },
  ];
  return packs.map((p) => ({
    ...p,
    discountPercent: Math.max(
      0,
      Math.round((1 - p.totalCents / p.listTotalCents) * 100),
    ),
  }));
}

export function getFreeCreditPack(id: string): FreeCreditPack | null {
  return freeCreditPacks().find((p) => p.id === id) ?? null;
}

export function creditPacksAvailableForPlan(plan: Plan): boolean {
  return plan === "FREE";
}
