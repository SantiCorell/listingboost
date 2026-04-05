/**
 * Primera página de Google vía SerpAPI (organic + related + PAA).
 * Documentación: https://serpapi.com/search-api
 */

import { buildGoogleSerpSearchUrl } from "@/lib/serp/google-rank";

type SerpOrganic = { title?: string; link?: string; snippet?: string; position?: number };
type RelatedItem = { query?: string };
type PaaItem = { question?: string; title?: string };

type SerpJson = {
  organic_results?: SerpOrganic[];
  related_searches?: RelatedItem[];
  people_also_ask?: PaaItem[];
  error?: string;
  search_metadata?: { status?: string };
};

export type OrganicSnapshotItem = {
  position: number;
  title: string;
  link: string;
  snippet: string;
};

export type GoogleSerpSnapshot = {
  organic: OrganicSnapshotItem[];
  relatedSearches: string[];
  peopleAlsoAsk: string[];
  error?: string;
  rawNote?: string;
};

export async function fetchGoogleSerpSnapshot(params: {
  keyword: string;
  googleDomain?: string;
  hl: string;
  gl: string;
  location?: string;
}): Promise<GoogleSerpSnapshot> {
  const apiKey = process.env.SERPAPI_API_KEY?.trim();
  if (!apiKey) {
    return {
      organic: [],
      relatedSearches: [],
      peopleAlsoAsk: [],
      error: "Falta SERPAPI_API_KEY en el servidor.",
    };
  }

  const googleDomain = params.googleDomain ?? process.env.SERPAPI_GOOGLE_DOMAIN?.trim() ?? "google.es";
  const location =
    params.location?.trim() || process.env.SERPAPI_LOCATION?.trim() || undefined;
  const device = (process.env.SERPAPI_DEVICE === "mobile" ? "mobile" : "desktop") as
    | "desktop"
    | "mobile"
    | "tablet";

  const query = params.keyword.trim();
  if (!query) {
    return { organic: [], relatedSearches: [], peopleAlsoAsk: [], error: "Keyword vacía." };
  }

  const url = buildGoogleSerpSearchUrl({
    apiKey,
    query,
    start: 0,
    googleDomain,
    hl: params.hl.trim() || "es",
    gl: params.gl.trim() || "es",
    location,
    device,
  });

  try {
    const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
    const data = (await res.json()) as SerpJson;

    if (!res.ok) {
      return {
        organic: [],
        relatedSearches: [],
        peopleAlsoAsk: [],
        error: data.error ?? `HTTP ${res.status}`,
      };
    }
    if (data.error) {
      return { organic: [], relatedSearches: [], peopleAlsoAsk: [], error: data.error };
    }

    const organic: OrganicSnapshotItem[] = [];
    const raw = data.organic_results ?? [];
    for (let i = 0; i < raw.length; i++) {
      const r = raw[i]!;
      const link = r.link?.trim() ?? "";
      if (!link) continue;
      const pos =
        typeof r.position === "number" && r.position > 0 ? r.position : i + 1;
      organic.push({
        position: pos,
        title: (r.title ?? "").trim() || "(sin título)",
        link,
        snippet: (r.snippet ?? "").trim(),
      });
    }

    const relatedSearches = (data.related_searches ?? [])
      .map((x) => (typeof x.query === "string" ? x.query.trim() : ""))
      .filter(Boolean);

    const peopleAlsoAsk = (data.people_also_ask ?? [])
      .map((x) => (typeof x.question === "string" ? x.question.trim() : x.title?.trim() ?? ""))
      .filter(Boolean);

    return { organic, relatedSearches, peopleAlsoAsk };
  } catch (e) {
    return {
      organic: [],
      relatedSearches: [],
      peopleAlsoAsk: [],
      error: e instanceof Error ? e.message : "Error de red con SerpAPI",
    };
  }
}
