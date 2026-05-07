"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false, // App Router needs manual pageview tracking
    persistence: "localStorage",
    // Session recording — actual recording still requires the project-level
    // toggle in the PostHog dashboard (Settings → Project → Recordings).
    disable_session_recording: false,
    session_recording: {
      // Mask password fields automatically (already on by default, made explicit)
      maskInputOptions: { password: true },
      // Don't mask other inputs — we want to see what homeowners type so we can
      // diagnose form drop-offs. Switch to maskAllInputs: true if needed for PII.
      maskAllInputs: false,
    },
    // NOTE: Recording sample rate is configured in the PostHog dashboard
    // (Settings → Project → Session replay → "Sample rate"). Set it to 0.5
    // there to record 50% of sessions and stretch the free 5k/month pool.
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
