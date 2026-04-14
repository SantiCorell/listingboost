export type KeywordLandingFaq = {
  question: string;
  answer: string;
};

export type KeywordLandingDefinition = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whatIsTitle: string;
  whatIsBody: string[];
  whatIsBullets: string[];
  includesTitle: string;
  includesBullets: string[];
  includesClosing: string;
  importanceTitle: string;
  importanceBody: string[];
  importanceBullets: string[];
  listingBoostTitle: string;
  listingBoostBody: string[];
  listingBoostBullets: string[];
  /** Bloque largo único por URL para densidad editorial y variaciones léxicas. */
  executionPlaybook: string[];
  internalMeshLead: string;
  faq: KeywordLandingFaq[];
};
