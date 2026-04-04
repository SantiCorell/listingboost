"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { JobNotificationsProvider } from "@/components/jobs/job-notifications-provider";
import { CookieConsentProvider } from "@/components/legal/cookie-consent-context";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";

export function AppProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus>
      <CookieConsentProvider>
        <PageViewTracker />
        <JobNotificationsProvider />
        {children}
        <CookieConsentBanner />
      </CookieConsentProvider>
    </SessionProvider>
  );
}
