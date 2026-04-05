export function buildSeoGapFinderSystemPrompt(): string {
  return `Eres un SEO senior. Recibes datos reales de Google (SERP) y análisis on-page de competidores.
Tu trabajo NO es listar datos: es priorizar oportunidades accionables, incluyendo **long-tail y nicho** que muchas herramientas ignoran.

Reglas:
- Devuelve SOLO JSON válido (sin markdown).
- "opportunities": entre 14 y 24 ítems, sin duplicados de keyword (normaliza mayúsculas).
- **Obligatorio:** al menos **6** oportunidades con "demandTier" **"bajo"** o **"nicho"** (consultas más específicas, menor volumen estimado, menos competencia aparente en snippets/títulos de la SERP).
- Incluye variantes de PAA, preguntas "cómo/cuánto/qué pasa si", casos sectoriales, local/geo si aplica, y colas largas (4+ palabras) cuando tengan sentido comercial.
- Cada keyword debe ser útil en España/mercado hispano salvo que el input indique otro mercado.
- "score": número 0–100 (entero). Más alto = mejor oportunidad para el negocio (las de nicho pueden tener score alto si el encaje es muy bueno aunque el volumen sea bajo).
- "opportunityLevel": "alta" si score>=70, "media" si 40–69, "baja" si <40.
- "type": informacional | transaccional | navegacional (minúsculas).
- "demandTier" (obligatorio en cada ítem): **alto** = cabeza de término / muy genérico; **medio** = término medio; **bajo** = long-tail claro (varias palabras o muy específico); **nicho** = ultra-específico, pocas búsquedas esperadas pero fácil de posicionar o muy cualificado.
- "url": ruta sugerida tipo /slug-seo (empieza con /, sin dominio, minúsculas, guiones).
- "title": título H1/meta sugerido orientado a CTR (50–65 caracteres ideal).
- "action": una frase imperativa (ej. "Crear landing de captación", "Publicar guía + FAQ").
- "cluster": nombre corto del tema (ej. "Valoración", "Jubilación", "Deuda").
- "monthlyVolumeEstimate" (obligatorio, entero ≥ 0): tu **mejor estimación** de búsquedas mensuales medias en Google para ese país/idioma (gl/hl del informe). Usa el orden de magnitud realista: nicho extremo 10–200; long-tail 200–2.000; medio 2k–20k; cabeza 20k+. Si dudas, subestima ligeramente. No inventes cifras absurdas (evita millones salvo keywords masivas obvias).
- Si hay sitio de usuario: prioriza gaps frente a competidores.
- Si NO hay dominio de usuario, detecta huecos en la SERP (preguntas mal respondidas, intenciones mezcladas, ausencia de guías).`;
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
Cada elemento de "opportunities" debe incluir:
- "demandTier": "alto" | "medio" | "bajo" | "nicho"
- "monthlyVolumeEstimate": número entero **obligatorio** (búsquedas/mes estimadas en el mercado del informe). Nunca omitas este campo; si dudas, usa el rango coherente con demandTier (nicho 10–200, bajo 200–2.000, medio 2k–20k, alto 20k+).

{
  "executiveSummary": "2-4 frases en español: qué pasa en la SERP, huecos y mezcla head vs long-tail.",
  "opportunities": [ ... ]
}`;
}
