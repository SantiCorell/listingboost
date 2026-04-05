import type { SeoGapDemandTier, SeoGapOpportunity } from "@/types/seo-gap-finder";

/**
 * Banda central coherente con el prompt SEO Gap (órdenes de magnitud realistas).
 * Solo se usa si el modelo no devolvió monthlyVolumeEstimate.
 */
export function estimateMonthlyVolumeFromTier(tier: SeoGapDemandTier): number {
  switch (tier) {
    case "alto":
      return 28_000;
    case "medio":
      return 7_500;
    case "bajo":
      return 900;
    case "nicho":
      return 120;
    default:
      return 900;
  }
}

/**
 * Rellena volumen ausente a partir de demandTier (no sustituye cifras ya informadas).
 */
export function fillMissingMonthlyVolumes(opportunities: SeoGapOpportunity[]): SeoGapOpportunity[] {
  return opportunities.map((o) => {
    if (o.monthlyVolumeEstimate != null && Number.isFinite(o.monthlyVolumeEstimate)) return o;
    return {
      ...o,
      monthlyVolumeEstimate: estimateMonthlyVolumeFromTier(o.demandTier),
    };
  });
}

function normalizeKey(k: string): string {
  return k.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Google Trends puede devolver variantes de la query; intentamos alinear con las keywords del informe.
 */
export function attachTrendsFuzzy(
  opportunities: SeoGapOpportunity[],
  trendsMap: Map<string, number>,
): SeoGapOpportunity[] {
  const keys = [...trendsMap.keys()];
  return opportunities.map((o) => {
    if (o.trendsInterest != null) return o;
    const nk = normalizeKey(o.keyword);
    let ti = trendsMap.get(nk);
    if (ti != null) return { ...o, trendsInterest: ti };

    const nkCompact = nk.replace(/\s/g, "");
    for (const k of keys) {
      const kc = k.replace(/\s/g, "");
      if (kc === nkCompact || nk.includes(k) || k.includes(nk)) {
        ti = trendsMap.get(k);
        if (ti != null) return { ...o, trendsInterest: ti };
      }
    }

    let best: { k: string; score: number; v: number } | null = null;
    for (const k of keys) {
      if (k.length < 6 || nk.length < 6) continue;
      const longer = nk.length >= k.length ? nk : k;
      const shorter = nk.length >= k.length ? k : nk;
      if (!longer.includes(shorter)) continue;
      const score = shorter.length;
      const v = trendsMap.get(k);
      if (v == null) continue;
      if (!best || score > best.score) best = { k, score, v };
    }
    if (best) return { ...o, trendsInterest: best.v };
    return o;
  });
}
