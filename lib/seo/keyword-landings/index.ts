import type { KeywordLandingDefinition } from "./types";
import { landingsA } from "./landings-a";
import { landingsB } from "./landings-b";

export type { KeywordLandingDefinition, KeywordLandingFaq } from "./types";

const merged: Record<string, KeywordLandingDefinition> = {
  ...landingsA,
  ...landingsB,
};

export const KEYWORD_LANDING_BY_SLUG: Record<string, KeywordLandingDefinition> = merged;

export const KEYWORD_LANDING_SLUGS = Object.keys(merged).sort((a, b) => a.localeCompare(b, "es"));

export function getKeywordLanding(slug: string): KeywordLandingDefinition | undefined {
  return merged[slug];
}
