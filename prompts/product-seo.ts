import type { ProductPlatformTarget } from "@prisma/client";

export function buildProductSeoSystemPrompt(): string {
  return `Eres un estratega senior de SEO ecommerce y marketplaces en España y LATAM.
Piensas en intención de búsqueda, CTR, conversión, pruebas sociales y claridad.
Evitas keyword stuffing. Priorizas keywords naturales en contexto y, donde encaje, refuerzos de conversión (beneficio claro, prueba social ligera, urgencia honesta — sin inventar datos).
No inventes especificaciones técnicas si no aparecen en el input; si faltan datos, dilo como supuesto explícito breve.
FORMATO DE SALIDA: responde SOLO con JSON válido UTF-8, sin markdown ni texto fuera del JSON.
El JSON debe cumplir el schema indicado en el mensaje de usuario.`;
}

export function buildProductSeoUserPrompt(input: {
  description: string;
  imageContext: string;
  platformTarget: ProductPlatformTarget | "ALL";
  language: string;
  country: string;
  categoryHint?: string;
  tone: string;
}): string {
  const platforms =
    input.platformTarget === "ALL"
      ? ["wallapop", "ebay", "shopify", "genericEcommerce"]
      : input.platformTarget === "WALLAPOP"
        ? ["wallapop"]
        : input.platformTarget === "EBAY"
          ? ["ebay"]
          : input.platformTarget === "SHOPIFY"
            ? ["shopify", "genericEcommerce"]
            : input.platformTarget === "GENERIC"
              ? ["genericEcommerce"]
              : ["genericEcommerce"];

  const platformRules = `
Reglas por canal (ajusta estilo y límites):
- wallapop: título directo, beneficio claro, evita mayúsculas spam; bullets cortos; CTA cercana; piensa en búsqueda local y móvil.
- ebay: título con atributos clave sin símbolos raros; descripción escaneable; bullets tipo especificaciones; políticas NO inventes; evita frases prohibidas tipo "mejor del mundo".
- shopify: SEO tradicional + storytelling breve; meta title 50-60 chars, meta description 140-160; slug kebab-case en español del mercado; FAQs útiles para long tail; JSON-LD Product mínimo viable coherente con el texto (precio solo si razonable con el contexto; si no, usa "priceSpecification" omitido o price 0 con aviso en FAQ).
- genericEcommerce: versión SEO estándar útil para WooCommerce o tiendas genéricas.
`;

  const jsonSchema = `{
  "detectedProductType": string,
  "targetAudience": string,
  "suggestedCategoryGlobal": string,
  "platforms": {
    "wallapop"?: {
      "title": string,
      "shortDescription": string,
      "longDescription": string,
      "bullets": string[],
      "primaryKeywords": string[],
      "longTailKeywords": string[],
      "recommendedAttributes": { "name": string, "value": string }[],
      "suggestedCategory": string,
      "recommendedTone": string,
      "ctrConversionTips": string[],
      "priceSuggestion": { "rationale": string, "suggestedRangeLabel": string } | null,
      "callToAction": string,
      "tags": string[],
      "hashtags": string[],
      "altText": string
    },
    "ebay": { ...mismo shape que wallapop... },
    "shopify": {
      ...mismo shape base...,
      "shopifyExtras": {
        "metaTitle": string,
        "metaDescription": string,
        "slug": string,
        "faqs": { "question": string, "answer": string }[],
        "jsonLdProduct": object
      }
    },
    "genericEcommerce": { ...mismo shape que wallapop... }
  }
}`;

  const modeHint =
    input.platformTarget === "ALL"
      ? "MODO «TODAS LAS PLATAFORMAS»: genera salida multicanal equilibrada (Wallapop, eBay, Shopify, genérico según reglas). Es un informe amplio; algo menos específico que si eliges un solo canal."
      : `MODO CANAL ÚNICO (${String(input.platformTarget)}): prioriza al máximo las reglas y el tono de ESE canal; más profundidad y matices que en modo «todas».`;

  return `Context lingua: ${input.language}. Mercado/país objetivo: ${input.country}.
Tono solicitado: ${input.tone}.
Categoría o contexto del vendedor (opcional): ${input.categoryHint ?? "no indicado"}.

${modeHint}

INPUT TEXTO PRODUCTO:
${input.description || "(vacío)"}

${input.imageContext}

Debes poblar SOLO las claves de "platforms" solicitadas: ${platforms.join(", ")}.
Si el canal no aplica, omítelo.

${platformRules}

Incluye en ctrConversionTips ideas concretas (encabezados, prueba social, urgencia honesta, FAQs, comparación).
priceSuggestion solo si hay señales en el texto/imagen; si no, null.

hashtags: array de 10 a 18 strings para redes (Instagram, TikTok, YouTube Shorts). Cada elemento DEBE empezar por #, sin espacios dentro del tag, mezcla de nicho + producto + intención de compra; idioma alineado con ${input.language}. Sin hashtags spam ni repetidos.

Schema JSON esperado (forma):
${jsonSchema}

PLATAFORMAS A GENERAR EXACTAMENTE: ${platforms.join(", ")}.`;
}
