/** Clave única del consentimiento de cookies (localStorage). */
export const LB_COOKIE_CONSENT_KEY = "lb_cookie_consent_v1";

export type StoredCookieConsent = { v: 1; analytics: boolean; at: string };

/** `true` = analíticas sí, `false` = solo necesarias, `null` = sin decisión. */
export function readAnalyticsChoiceFromStorage(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LB_COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as StoredCookieConsent;
    return j.analytics === true;
  } catch {
    return null;
  }
}
