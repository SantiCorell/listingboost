/**
 * Posición aproximada en Google (organic) vía SerpAPI.
 * Documentación parámetros: https://serpapi.com/search-api
 *
 * Usa dominio Google ES, localización España (`gl`, `hl`, opcional `location`),
 * y pagina resultados (start=0,10,…) hasta encontrar la URL o agotar el límite.
 */

const SLEEP_MS_BETWEEN_PAGES = 120;

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function normalizeHost(h: string): string {
  return h.replace(/^www\./, "").toLowerCase();
}

type SerpOrganic = { link?: string; position?: number; title?: string };
type SerpJson = {
  organic_results?: SerpOrganic[];
  error?: string;
  search_metadata?: { status?: string; id?: string };
  search_information?: {
    organic_results_state?: string;
    query_displayed?: string;
  };
};

function findHostInOrganic(
  organic: SerpOrganic[] | undefined,
  targetHost: string,
  pageStart: number,
): { position: number; title?: string } | null {
  if (!organic?.length) return null;
  const want = normalizeHost(targetHost);
  for (let i = 0; i < organic.length; i++) {
    const r = organic[i];
    const link = r.link ?? "";
    try {
      const u = new URL(link);
      const h = normalizeHost(u.hostname);
      if (h === want || h.endsWith(`.${want}`)) {
        const pos =
          typeof r.position === "number" && r.position > 0
            ? r.position
            : pageStart + i + 1;
        return { position: pos, title: r.title };
      }
    } catch {
      /* ignore bad link */
    }
  }
  return null;
}

function buildSearchUrl(params: {
  apiKey: string;
  query: string;
  start: number;
  googleDomain: string;
  hl: string;
  gl: string;
  location?: string;
  device: "desktop" | "mobile" | "tablet";
}): string {
  const u = new URL("https://serpapi.com/search.json");
  u.searchParams.set("engine", "google");
  u.searchParams.set("q", params.query);
  u.searchParams.set("api_key", params.apiKey);
  u.searchParams.set("google_domain", params.googleDomain);
  u.searchParams.set("hl", params.hl);
  u.searchParams.set("gl", params.gl);
  u.searchParams.set("device", params.device);
  /** 0 = menos agresivo con "resultados omitidos" (mejor para tracking SEO). */
  u.searchParams.set("filter", "0");
  if (params.start > 0) u.searchParams.set("start", String(params.start));
  if (params.location?.trim()) u.searchParams.set("location", params.location.trim());
  return u.toString();
}

function serpErrorMessage(data: SerpJson, httpStatus: number): string {
  if (data.error) return data.error;
  if (data.search_metadata?.status && data.search_metadata.status !== "Success") {
    return `SerpAPI: ${data.search_metadata.status}`;
  }
  return `HTTP ${httpStatus}`;
}

export async function fetchOrganicPosition(params: {
  keyword: string;
  targetHost: string;
  /** google.es, google.com, etc. */
  googleDomain?: string;
  /** Código idioma interfaz (es). */
  hl?: string;
  /** País de la búsqueda (es = España). */
  gl?: string;
  /** Ciudad/región para simular usuario local (ej. "Madrid, Spain"). Opcional vía env. */
  location?: string;
}): Promise<{ position: number | null; note?: string; raw?: unknown }> {
  const apiKey = process.env.SERPAPI_API_KEY?.trim();
  if (!apiKey) {
    return {
      position: null,
      note: "Falta SERPAPI_API_KEY en el servidor.",
    };
  }

  const googleDomain = params.googleDomain ?? process.env.SERPAPI_GOOGLE_DOMAIN?.trim() ?? "google.es";
  const hl = params.hl ?? process.env.SERPAPI_HL?.trim() ?? "es";
  const gl = params.gl ?? process.env.SERPAPI_GL?.trim() ?? "es";
  const location =
    params.location?.trim() ||
    process.env.SERPAPI_LOCATION?.trim() ||
    undefined;

  const maxPages = Math.min(
    20,
    Math.max(
      1,
      Number.parseInt(process.env.SERPAPI_MAX_ORGANIC_PAGES ?? "6", 10) || 6,
    ),
  );
  const device = (process.env.SERPAPI_DEVICE === "mobile" ? "mobile" : "desktop") as
    | "desktop"
    | "mobile"
    | "tablet";

  const query = params.keyword.trim();
  if (!query) {
    return { position: null, note: "Keyword vacía." };
  }

  const host = normalizeHost(params.targetHost);

  let lastRaw: SerpJson | undefined;
  let lastNote: string | undefined;

  try {
    for (let page = 0; page < maxPages; page++) {
      const start = page * 10;
      const url = buildSearchUrl({
        apiKey,
        query,
        start,
        googleDomain,
        hl,
        gl,
        location,
        device,
      });

      const res = await fetch(url, {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      const data = (await res.json()) as SerpJson;
      lastRaw = data;

      if (!res.ok) {
        return {
          position: null,
          note: serpErrorMessage(data, res.status),
          raw: data,
        };
      }

      if (data.error) {
        return { position: null, note: data.error, raw: data };
      }

      const organic = data.organic_results ?? [];
      const found = findHostInOrganic(organic, host, start);
      if (found) {
        return {
          position: found.position,
          note: found.title
            ? `Encontrado: ${found.title.slice(0, 120)}${found.title.length > 120 ? "…" : ""}`
            : `Posición orgánica aproximada (${googleDomain}, gl=${gl}).`,
          raw: data,
        };
      }

      if (data.search_information?.organic_results_state === "Fully empty") {
        lastNote = "Sin resultados orgánicos para esta consulta.";
        break;
      }

      if (organic.length < 10) {
        break;
      }

      if (page < maxPages - 1) {
        await sleep(SLEEP_MS_BETWEEN_PAGES);
      }
    }

    return {
      position: null,
      note:
        lastNote ??
        `Tu dominio no aparece en los primeros ${maxPages * 10} resultados orgánicos para esta búsqueda (${googleDomain}, gl=${gl}).`,
      raw: lastRaw,
    };
  } catch (e) {
    return {
      position: null,
      note: e instanceof Error ? e.message : "Error al llamar a SerpAPI",
    };
  }
}
