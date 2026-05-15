"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { subscribeToCheatsheetAction } from "@/app/actions/subscribe-cheatsheet";

const SHOWN_KEY = "ds_exit_popup_seen";          // sessionStorage — show at most once per tab session
const DISMISSED_KEY = "ds_exit_popup_dismissed"; // localStorage — dismissed for 7 days
const LEAD_SUBMITTED_KEY = "ds_lead_submitted";  // sessionStorage — set by all 3 lead forms on success
const DISMISS_DAYS = 7;
const ARM_DELAY_MS = 90_000;                     // 90 seconds — let visitors browse before we ask

export default function ExitIntentPopup({ variant = "" }: { variant?: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const armedRef = useRef(false);

  // ─── Detect city / ZIP for the payload ─────────────────────────────────
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { city?: string; postal?: string; country_code?: string } | null) => {
        if (d?.country_code !== "US") return;
        if (d.city) setCity(d.city);
        if (d.postal && /^\d{5}$/.test(d.postal)) setZip(d.postal);
      })
      .catch(() => {});
  }, []);

  // ─── Decide whether to arm at all ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already shown this tab session.
    if (sessionStorage.getItem(SHOWN_KEY) === "1") return;

    // Already submitted the lead form — never bother them with the popup.
    if (sessionStorage.getItem(LEAD_SUBMITTED_KEY) === "1") return;

    // Dismissed in the last 7 days — respect that.
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const ageMs = Date.now() - Number(dismissedAt);
      if (ageMs < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    // Wait ARM_DELAY_MS so the visitor can read the page first.
    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
    }, ARM_DELAY_MS);

    function trigger() {
      if (!armedRef.current) return;
      // Re-check at trigger time too — they may have submitted in the last 90s.
      if (sessionStorage.getItem(LEAD_SUBMITTED_KEY) === "1") return;
      armedRef.current = false;
      sessionStorage.setItem(SHOWN_KEY, "1");
      setOpen(true);
      try {
        posthog.capture("exit_intent_shown", { variant });
      } catch { /* noop */ }
    }

    // Desktop exit signal: mouse leaves the top of the viewport (toward
    // the close-tab / address bar).
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) trigger();
    }
    document.addEventListener("mouseleave", onMouseLeave);

    // Cross-platform exit signal: visitor switches tabs / apps (mobile back
    // gesture or desktop alt-tab usually fires this).
    function onVisibility() {
      if (document.visibilityState === "hidden") trigger();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(armTimer);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]);

  function dismiss() {
    setOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await subscribeToCheatsheetAction({
        email,
        variant: variant || undefined,
        city: city || undefined,
        zipCode: zip || undefined,
      });
      if ("error" in res) {
        setError(res.error);
      } else {
        setSubmitted(true);
        try {
          posthog.capture("cheatsheet_subscribed", { variant, source: "exit_intent_popup" });
        } catch { /* noop */ }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm transition-opacity"
        onClick={dismiss}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-popup-title"
      >
        <div
          className="pointer-events-auto bg-white rounded-2xl shadow-[0_30px_80px_rgba(15,41,64,0.35)] max-w-[460px] w-full overflow-hidden border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-primary text-white px-6 py-5">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#a8c0a4] mb-1.5">
              Wait! Free for you
            </p>
            <h2 id="exit-popup-title" className="text-xl sm:text-2xl font-bold leading-tight">
              {submitted
                ? "Cheatsheet on its way."
                : "Get the free Renovation Cost Cheatsheet"}
            </h2>
          </div>

          <div className="px-6 py-5">
            {submitted ? (
              <>
                <p className="text-foreground text-[15px] leading-relaxed mb-2">
                  Check your inbox in the next minute. If you don&apos;t see it, peek in <strong>Promotions</strong> or <strong>Spam</strong> and mark as Not Spam so future emails arrive in your main inbox.
                </p>
                <p className="text-muted-foreground text-[13px] mb-5">
                  Want a contractor match too? Up to 4 verified pros in 24 hours, free.
                </p>
                <a
                  href="/#project-form"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-accent !text-white rounded-xl text-[14.5px] font-semibold hover:brightness-110 transition shadow-[0_4px_14px_rgba(107,142,107,0.4)]"
                >
                  Get matched in 24 hrs
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </>
            ) : (
              <>
                <p className="text-foreground text-[14.5px] leading-relaxed mb-4">
                  National pricing for kitchens, baths, roofing & painting · regional adjustments · 5 questions to ask any contractor before you hire. Sent to your inbox in 60 seconds.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={
                      "w-full px-4 py-3 bg-background border rounded-lg text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 transition " +
                      (error ? "border-red-400" : "border-border focus:border-primary")
                    }
                  />
                  {error && (
                    <div className="text-[12.5px] text-red-600 font-medium">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent !text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition shadow-[0_4px_14px_rgba(107,142,107,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending…" : "Email me the cheatsheet"}
                  </button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    No spam. Unsubscribe any time. Never sold or shared.
                  </p>
                </form>
                <button
                  type="button"
                  onClick={dismiss}
                  className="block w-full text-center mt-3 text-[12px] text-muted-foreground hover:text-foreground transition"
                >
                  No thanks
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
