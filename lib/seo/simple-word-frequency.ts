import { SPANISH_STOPWORDS } from "@/lib/seo/stopwords-es";

/** Tokens alfanuméricos en minúsculas, sin stopwords triviales. */
export function topWordFrequency(text: string, limit = 18): { word: string; count: number }[] {
  const raw = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^a-z0-9áéíóúüñ]+/u)
    .filter((w) => w.length > 2);
  const stop = SPANISH_STOPWORDS;
  const counts = new Map<string, number>();
  for (const w of raw) {
    if (stop.has(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}
