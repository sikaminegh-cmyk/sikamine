"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";

const STORAGE_KEY = "sikamine-cookie-consent";
type Consent = "accepted" | "declined" | null;

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Consent {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "accepted" || stored === "declined" ? stored : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): Consent {
  return null;
}

function setConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // storage unavailable — the banner will simply reappear next visit
  }
  listeners.forEach((listener) => listener());
}

/** True while the consent banner is still showing (no choice made yet) — used
 * by other fixed-position UI (e.g. the scroll-to-top button) to avoid
 * overlapping it and blocking its clicks. */
export function useCookieConsentPending() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) === null;
}

export function CookieConsent({ analyticsId }: { analyticsId: string | null }) {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <>
      {analyticsId && choice === "accepted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsId}');`}
          </Script>
        </>
      )}

      {choice === null && (
        <div className="fixed inset-x-4 bottom-4 z-60 mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-5 shadow-xl motion-safe:animate-[bannerIn_0.5s_ease-out] sm:inset-x-auto sm:right-4">
          <p className="text-sm text-text">
            We use essential cookies to run this site, and, with your consent, analytics cookies to understand
            traffic. See our <Link href="/cookies" className="underline">Cookie Policy</Link>.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setConsent("accepted")}
              className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-dark hover:shadow-md hover:shadow-orange/20 active:translate-y-0 active:scale-[0.97]"
            >
              Accept
            </button>
            <button
              onClick={() => setConsent("declined")}
              className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-text transition-colors duration-200 hover:bg-bg-alt"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
