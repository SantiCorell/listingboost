export function buildSeoGapFinderSystemPrompt(): string {
  return `Eres un SEO senior. Recibes datos reales de Google (SERP) y análisis on-page de competidores.
Tu trabajo NO es listar datos: es priorizar oportunidades accionables.

Reglas:
- Devuelve SOLO JSON válido (sin markdown).
- "opportunities": entre 8 y 18 ítems, sin duplicados de keyword (normaliza mayúsculas).
- Cada keyword debe ser útil en España/mercado hispano salvo que el input indique otro mercado.
- "score": número 0–100 (entero). Más alto = mejor oportunidad para el negocio.
- "opportunityLevel": "alta" si score>=70, "media" si 40–69, "baja" si <40.
- "type": informacional | transaccional | navegacional (minúsculas).
- "url": ruta sugerida tipo /slug-seo (empieza con /, sin dominio, minúsculas, guiones).
- "title": título H1/meta sugerido orientado a CTR (50–65 caracteres ideal).
- "action": una frase imperativa (ej. "Crear landing de captación", "Ampliar guía con FAQ").
- "cluster": nombre corto del tema (ej. "Herramientas IA", "Precios y planes").
- Si hay "userGap": prioriza keywords que competidores cubren y el usuario NO (mayor score).
- Si NO hay dominio de usuario, igualmente sugiere oportunidades basadas en huecos en SERP (preguntas, long-tail, intenciones poco cubiertas en snippets).`;
}

export function buildSeoGapFinderUserPrompt(payload: {
  keyword: string;
  domain: string | null;
  country: string;
  language: string;
  organic: { position: number; title: string; link: string; snippet: string }[];
  relatedSearches: string[];
  peopleAlsoAsk: string[];
  competitors: {
    url: string;
    position: number;
    title: string;
    snippet: string;
    metaTitle: string | null;
    metaDescription: string | null;
    h1: string[];
    h2: string[];
    topWords: { word: string; count: number }[];
  }[];
  userSite?: {
    url: string;
    metaTitle: string | null;
    metaDescription: string | null;
    h1: string[];
    topWords: { word: string; count: number }[];
  } | null;
}): string {
  return `## Consulta principal
keyword: ${payload.keyword}
dominio_usuario (opcional): ${payload.domain ?? "—"}
país (gl): ${payload.country}
idioma (hl): ${payload.language}

## Top orgánicos (Google)
${JSON.stringify(payload.organic.slice(0, 10), null, 0)}

## Búsquedas relacionadas
${JSON.stringify(payload.relatedSearches.slice(0, 12), null, 0)}

## People also ask
${JSON.stringify(payload.peopleAlsoAsk.slice(0, 8), null, 0)}

## Competidores (crawl resumido)
${JSON.stringify(payload.competitors, null, 0)}

## Sitio del usuario (si existe)
${payload.userSite ? JSON.stringify(payload.userSite, null, 0) : "null"}

## Salida JSON exacta
{
  "executiveSummary": "2-4 frases en español: qué está pasando en la SERP y el enfoque recomendado.",
  "opportunities": [ ... ]
}`;
}
