/** Salida de `services/seo/content-generator.ts`. */
export type ContentGeneratorOutput = {
  h1: string;
  outline: Array<{ h2: string; body: string; h3?: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
  jsonLdFaq?: unknown;
  metaTitle: string;
  metaDescription: string;
};

export function isContentGeneratorOutput(v: unknown): v is ContentGeneratorOutput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (typeof o.h1 !== "string" || typeof o.metaTitle !== "string" || typeof o.metaDescription !== "string")
    return false;
  if (!Array.isArray(o.outline) || !Array.isArray(o.faqs)) return false;
  for (const item of o.outline) {
    if (!item || typeof item !== "object") return false;
    const b = item as Record<string, unknown>;
    if (typeof b.h2 !== "string" || typeof b.body !== "string") return false;
  }
  for (const f of o.faqs) {
    if (!f || typeof f !== "object") return false;
    const q = f as Record<string, unknown>;
    if (typeof q.question !== "string" || typeof q.answer !== "string") return false;
  }
  return true;
}
