import type { ProductAnalysisOutput, PlatformContent } from "@/types/product-analysis";

function normalizeTag(raw: string): string {
  const t = String(raw).trim();
  if (!t) return "";
  const inner = t.replace(/^#+/u, "").replace(/\s+/gu, "");
  if (!inner) return "";
  return `#${inner.slice(0, 60)}`;
}

function uniqueHashtags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const h of tags) {
    const n = h.toLowerCase();
    if (n.length < 2 || seen.has(n)) continue;
    seen.add(n);
    out.push(h);
  }
  return out.slice(0, 24);
}

/** Normaliza # y rellena desde keywords/tags si el modelo no devolvió hashtags. */
export function enrichProductOutputWithHashtags(data: ProductAnalysisOutput): ProductAnalysisOutput {
  const next = structuredClone(data) as ProductAnalysisOutput;
  const process = (pc: PlatformContent | undefined) => {
    if (!pc) return;
    let list = (pc.hashtags ?? []).map(normalizeTag).filter(Boolean);
    if (list.length < 6) {
      const pool = [
        ...pc.primaryKeywords,
        ...pc.longTailKeywords,
        ...pc.tags,
        pc.suggestedCategory,
      ];
      for (const raw of pool) {
        if (list.length >= 18) break;
        const h = normalizeTag(raw);
        if (h.length > 2) list.push(h);
      }
      list = uniqueHashtags(list);
    } else {
      list = uniqueHashtags(list);
    }
    pc.hashtags = list;
  };

  process(next.platforms.wallapop);
  process(next.platforms.ebay);
  process(next.platforms.shopify);
  process(next.platforms.genericEcommerce);

  return next;
}
