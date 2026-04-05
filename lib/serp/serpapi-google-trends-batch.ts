/**
 * Google Trends vía SerpAPI: interés relativo 0–100 (no es volumen absoluto).
 * Último periodo del timeline = proxy de “fuerza” reciente en el geo.
 * Docs: https://serpapi.com/google-trends-api
 */

type TrendsJson = {
  error?: string;
  interest_over_time?: {
    timeline_data?: {
      timestamp?: string;
      values?: { query?: string; extracted_value?: number }[];
    }[];
  };
};

function normalizeKey(k: string): string {
  return k.trim().toLowerCase();
}

/** Máx. 5 queries por request (TIMESERIES). */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Devuelve interés Trends (0–100) del último punto temporal por keyword.
 */
export async function fetchGoogleTrendsInterestLastPeriod(params: {
  keywords: string[];
  hl: string;
  geo: string;
}): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  const apiKey = process.env.SERPAPI_API_KEY?.trim();
  if (!apiKey) return result;

  const unique = [...new Set(params.keywords.map((k) => k.trim()).filter(Boolean))];
  if (unique.length === 0) return result;

  const hl = params.hl.trim() || "es";
  const geo = params.geo.trim().toUpperCase() || "ES";

  const batches = chunk(unique, 5);

  for (const batch of batches) {
    const q = batch.map((k) => k.replace(/,/g, " ").trim()).join(",");
    if (!q) continue;

    const sp = new URLSearchParams({
      engine: "google_trends",
      api_key: apiKey,
      data_type: "TIMESERIES",
      hl,
      geo,
      q,
      date: "today 3-m",
    });

    try {
      const res = await fetch(`https://serpapi.com/search.json?${sp.toString()}`, {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      const data = (await res.json()) as TrendsJson;
      if (!res.ok || data.error) continue;

      const timeline = data.interest_over_time?.timeline_data ?? [];
      const last = timeline[timeline.length - 1];
      for (const v of last?.values ?? []) {
        const query = typeof v.query === "string" ? v.query.trim() : "";
        const val = v.extracted_value;
        if (!query || typeof val !== "number") continue;
        result.set(normalizeKey(query), val);
      }
    } catch {
      /* ignore chunk */
    }
  }

  return result;
}
