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
    // Sample 50% of sessions — stretches the 5k/month free pool to ~10k visitors.
    // Bump back to 1 when traffic justifies a paid plan.
    session_recording_sample_rate: 0.5,
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
