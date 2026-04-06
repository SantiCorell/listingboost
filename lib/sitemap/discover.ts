const MAX_SITEMAP_FETCHES = 35;
const MAX_URLS_COLLECT = 8000;
const FETCH_TIMEOUT_MS = 18_000;

const UA = "Mozilla/5.0 (compatible; ListingBoost/1.0; +https://listingboost.es)";

export type SitemapDiscoveryReport = {
  seedUrl: string;
  origin: string;
  sitemapSourcesTried: string[];
  sitemapXmlUrls: string[];
  totalUrls: number;
  urlSample: string[];
  truncated: boolean;
  errors: string[];
};

function extractLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1]?.trim();
    if (u) out.push(u);
  }
  return out;
}

function isLikelySitemapIndex(xml: string): boolean {
  return /<sitemapindex[\s>]/i.test(xml) || /<sitemap>\s*<loc>/i.test(xml);
}

async function fetchText(url: string): Promise<{ ok: boolean; text: string; status: number }> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "application/xml,text/xml,*/*" },
      redirect: "follow",
    });
    const text = await res.text();
    return { ok: res.ok, text, status: res.status };
  } catch {
    return {
      ok: false,
      text: "",
      status: 0,
    };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Descubre sitemaps típicos (robots.txt + rutas habituales) y cuenta URLs (límite duro).
 */
export async function discoverSitemapReport(seedUrl: string): Promise<SitemapDiscoveryReport> {
  const errors: string[] = [];
  const sitemapSourcesTried: string[] = [];
  let origin: string;
  try {
    origin = new URL(seedUrl).origin;
  } catch {
    return {
      seedUrl,
      origin: "",
      sitemapSourcesTried: [],
      sitemapXmlUrls: [],
      totalUrls: 0,
      urlSample: [],
      truncated: false,
      errors: ["URL inválida"],
    };
  }

  const queue: string[] = [];
  const seenSitemaps = new Set<string>();
  const allPageUrls = new Set<string>();
  let fetchCount = 0;

  async function tryPushSitemap(u: string) {
    if (seenSitemaps.has(u) || fetchCount >= MAX_SITEMAP_FETCHES) return;
    seenSitemaps.add(u);
    queue.push(u);
  }

  // robots.txt
  const robotsUrl = `${origin}/robots.txt`;
  sitemapSourcesTried.push(robotsUrl);
  const robots = await fetchText(robotsUrl);
  fetchCount++;
  if (robots.ok && robots.text) {
    const lines = robots.text.split(/\r?\n/);
    for (const line of lines) {
      const m = /^\s*Sitemap:\s*(.+)$/i.exec(line);
      if (m?.[1]) {
        try {
          const su = new URL(m[1].trim()).href;
          await tryPushSitemap(su);
        } catch {
          /* */
        }
      }
    }
  }

  const fallbacks = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/wp-sitemap.xml`];
  for (const f of fallbacks) {
    sitemapSourcesTried.push(f);
    if (!seenSitemaps.has(f)) await tryPushSitemap(f);
  }

  if (queue.length === 0) {
    errors.push("No se encontró cola de sitemaps (robots vacío o sin Sitemap:).");
  }

  while (queue.length > 0 && fetchCount < MAX_SITEMAP_FETCHES && allPageUrls.size < MAX_URLS_COLLECT) {
    const smUrl = queue.shift()!;
    fetchCount++;
    const { ok, text, status } = await fetchText(smUrl);
    if (!ok || !text) {
      if (status === 404) errors.push(`Sitemap no encontrado: ${smUrl}`);
      else errors.push(`No se pudo leer: ${smUrl} (${status || "red"})`);
      continue;
    }

    if (isLikelySitemapIndex(text)) {
      const locs = extractLocs(text);
      for (const loc of locs) {
        try {
          const u = new URL(loc).href;
          if (/\.xml(\?|$)/i.test(u) || u.includes("wp-sitemap")) {
            await tryPushSitemap(u);
          } else {
            allPageUrls.add(u);
          }
        } catch {
          /* */
        }
      }
    } else {
      const locs = extractLocs(text);
      for (const loc of locs) {
        try {
          allPageUrls.add(new URL(loc).href);
        } catch {
          /* */
        }
        if (allPageUrls.size >= MAX_URLS_COLLECT) break;
      }
    }
  }

  const totalUrls = allPageUrls.size;
  const truncated = totalUrls >= MAX_URLS_COLLECT || fetchCount >= MAX_SITEMAP_FETCHES;
  const urlSample = Array.from(allPageUrls).slice(0, 40);

  return {
    seedUrl,
    origin,
    sitemapSourcesTried,
    sitemapXmlUrls: Array.from(seenSitemaps),
    totalUrls,
    urlSample,
    truncated,
    errors: errors.slice(0, 12),
  };
}
