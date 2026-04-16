export type KeywordLandingFaq = {
  question: string;
  answer: string;
};

export type KeywordLandingInternalMeshItem = {
  href: string;
  anchor: string;
  description: string;
};

export type KeywordLandingDeepSubsection = {
  h3: string;
  body: string;
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
  /** Hero + AEO + pasos + malla CTAs (landings de alta intención). */
  conversionPack?: boolean;
  aeoQuickAnswer?: {
    title: string;
    paragraphs: string[];
  };
  howToCheckSeoFree?: {
    title: string;
    intro: string;
    steps: string[];
    outro: string;
  };
  toolOnlineExplainer?: {
    title: string;
    paragraphs: string[];
  };
  aiCitationSentences?: string[];
  internalMeshItems?: KeywordLandingInternalMeshItem[];
  /** Contenido largo H2/H3 para intención transaccional + AEO. */
  deepDive?: {
    title: string;
    subsections: KeywordLandingDeepSubsection[];
  };
};
