export function buildContentGeneratorSystemPrompt(): string {
  return `Eres redactor SEO y CRO. Generas contenido en español (o el idioma que indique el usuario en keyword).
Solo JSON válido, sin markdown. Incluye FAQs útiles y tono conversión.`;
}

export function buildContentGeneratorUserPrompt(input: {
  keyword: string;
  type: "blog" | "product";
  country?: string;
}): string {
  return `Keyword principal: ${input.keyword}
Tipo: ${input.type === "blog" ? "artículo de blog" : "ficha / descripción de producto"}
${input.country ? `Mercado/país: ${input.country}` : ""}

JSON exacto:
{
  "h1": string,
  "outline": { "h2": string, "body": string, "h3"?: string[] }[],
  "faqs": { "question": string, "answer": string }[],
  "jsonLdFaq"?: object,
  "metaTitle": string,
  "metaDescription": string
}`;
}
