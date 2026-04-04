import * as cheerio from "cheerio";

export type ParsedUrlSummary = {
  finalUrl: string;
  statusCode: number;
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  robots: string | null;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  h1: string[];
  h2: string[];
  h3: string[];
  approximateWordCount: number;
  charCount: number;
  images: { src: string; alt: string | null; missingAlt: boolean }[];
  linksInternal: string[];
  linksExternal: string[];
  schemaHints: { type: string; rawSnippet: string }[];
  mainTextSample: string;
};

const DEFAULT_UA =
  "Mozilla/5.0 (compatible; ListingBoost/1.0; +https://listingboost.es)";

function absolutize(base: string, href: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

export async function fetchAndParseUrl(
  url: string,
  opts?: { timeoutMs?: number },
): Promise<ParsedUrlSummary> {
  const timeoutMs = opts?.timeoutMs ?? 20_000;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  let finalUrl = url;
  let statusCode = 0;
  let html = "";

  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": DEFAULT_UA, Accept: "text/html" },
    });
    statusCode = res.status;
    finalUrl = res.url;
    html = await res.text();
  } finally {
    clearTimeout(t);
  }

  const $ = cheerio.load(html);

  $("script, style, noscript").remove();

  const title = $("title").first().text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || null;
  const canonical = $('link[rel="canonical"]').attr("href")?.trim() || null;
  const robots = $('meta[name="robots"]').attr("content")?.trim() || null;

  const openGraph: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr("property");
    const content = $(el).attr("content");
    if (prop && content) openGraph[prop] = content;
  });

  const twitter: Record<string, string> = {};
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr("name");
    const content = $(el).attr("content");
    if (name && content) twitter[name] = content;
  });

  const h1 = $("h1")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const h2 = $("h2")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const h3 = $("h3")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  const baseHost = new URL(finalUrl).hostname;
  const images: ParsedUrlSummary["images"] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (!src) return;
    const abs = absolutize(finalUrl, src);
    const alt = $(el).attr("alt");
    const hasAlt = alt != null && alt.trim().length > 0;
    images.push({
      src: abs,
      alt: hasAlt ? alt!.trim() : null,
      missingAlt: !hasAlt,
    });
  });

  const linksInternal: string[] = [];
  const linksExternal: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
    try {
      const u = new URL(href, finalUrl);
      if (u.hostname === baseHost) linksInternal.push(u.href);
      else linksExternal.push(u.href);
    } catch {
      /* ignore */
    }
  });

  const schemaHints: ParsedUrlSummary["schemaHints"] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    let type = "Unknown";
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const first = parsed[0] as { "@type"?: string };
        type = first?.["@type"] ?? "Graph";
      } else if (parsed && typeof parsed === "object") {
        const o = parsed as { "@type"?: string; "@graph"?: unknown[] };
        type = o["@type"] ?? (o["@graph"] ? "Graph" : "JSON-LD");
      }
    } catch {
      type = "InvalidJSON";
    }
    schemaHints.push({
      type,
      rawSnippet: raw.slice(0, 400),
    });
  });

  const mainText = $("body").text().replace(/\s+/g, " ").trim();
  const words = mainText.length ? mainText.split(/\s+/).filter(Boolean) : [];

  return {
    finalUrl,
    statusCode,
    title,
    metaDescription,
    canonical,
    robots,
    openGraph,
    twitter,
    h1,
    h2,
    h3,
    approximateWordCount: words.length,
    charCount: mainText.length,
    images,
    linksInternal: [...new Set(linksInternal)],
    linksExternal: [...new Set(linksExternal)],
    schemaHints,
    mainTextSample: mainText.slice(0, 8000),
  };
}
