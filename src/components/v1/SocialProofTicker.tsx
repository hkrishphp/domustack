"use client";

import { useEffect, useRef, useState } from "react";
import { getRecentMatchesAction, type RecentMatch } from "@/app/actions/recent-matches";

const PROJECT_EMOJI: Record<string, string> = {
  "Bathroom Remodel": "🛁",
  "Kitchen Remodel": "🍳",
  "Roofing": "🏠",
  "Painting": "🎨",
  "Flooring": "🪵",
  "Hardwood Flooring": "🪵",
  "Whole Home Renovation": "🏘️",
  "Deck & Patio": "🪴",
  "Pool Installation": "🏊",
  "Basement Finishing": "🪜",
  "HVAC": "❄️",
  "Other": "🔨",
};

const MIN_FRESH_FOR_LIVE_FEED = 5;
const FRESH_WINDOW_MIN = 7 * 24 * 60; // 7 days — anything older is hidden entirely
const SHOW_TIMESTAMP_MAX_MIN = 24 * 60; // only show "X min ago" line for events ≤ 24h old
const FIRST_DELAY_MS = 8000;
const SHOW_DURATION_MS = 7000;
const NEXT_INTERVAL_MIN_MS = 30000;
const NEXT_INTERVAL_MAX_MS = 60000;
const SESSION_DISMISS_KEY = "ds_ticker_dismissed";

function fuzzyTime(mins: number): string {
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 90) return "an hour ago";
  if (mins < 24 * 60) return `${Math.round(mins / 60)} hours ago`;
  if (mins < 36 * 60) return "yesterday";
  return `${Math.round(mins / (24 * 60))} days ago`;
}

export default function SocialProofTicker() {
  const [matches, setMatches] = useState<RecentMatch[] | null>(null);
  const [city, setCity] = useState<string>("");
  const [current, setCurrent] = useState<RecentMatch | null>(null);
  const [scarcityVisible, setScarcityVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lastIndexRef = useRef(-1);

  // Check session-level dismissal on mount.
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_DISMISS_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  // Fetch matches + visitor city on mount.
  useEffect(() => {
    if (!mounted || dismissed) return;

    getRecentMatchesAction()
      .then(setMatches)
      .catch(() => setMatches([]));

    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { city?: string; country_code?: string } | null) => {
        if (data?.country_code === "US" && data.city) {
          setCity(data.city);
        }
      })
      .catch(() => {
        /* ad blocker / rate limit — fine */
      });
  }, [mounted, dismissed]);

  // Drive the show / hide cycle.
  useEffect(() => {
    if (dismissed || matches === null) return;

    const fresh = matches.filter((m) => m.minsAgo <= FRESH_WINDOW_MIN);
    const useLiveFeed = fresh.length >= MIN_FRESH_FOR_LIVE_FEED;

    let cycleTimer: number | undefined;
    let hideTimer: number | undefined;
    let cycleCount = 0;

    function showOne() {
      // Skip cycles when the tab isn't focused — don't burn rotations on no one.
      if (typeof document !== "undefined" && document.hidden) {
        cycleTimer = window.setTimeout(showOne, 5000);
        return;
      }

      if (useLiveFeed) {
        let i: number;
        do {
          i = Math.floor(Math.random() * fresh.length);
        } while (i === lastIndexRef.current && fresh.length > 1);
        lastIndexRef.current = i;
        setCurrent(fresh[i]);
        setScarcityVisible(false);
      } else if (cycleCount === 0 && city) {
        // No fresh data — show the "be one of the first" message ONCE.
        setScarcityVisible(true);
        setCurrent(null);
      } else {
        // Nothing to show; stay silent.
        return;
      }

      cycleCount++;

      // Hide after the show duration.
      hideTimer = window.setTimeout(() => {
        setCurrent(null);
        setScarcityVisible(false);
      }, SHOW_DURATION_MS);

      // Schedule the next cycle (live feed only — scarcity message shows once).
      if (useLiveFeed) {
        const nextDelay =
          SHOW_DURATION_MS +
          NEXT_INTERVAL_MIN_MS +
          Math.random() * (NEXT_INTERVAL_MAX_MS - NEXT_INTERVAL_MIN_MS);
        cycleTimer = window.setTimeout(showOne, nextDelay);
      }
    }

    cycleTimer = window.setTimeout(showOne, FIRST_DELAY_MS);

    return () => {
      if (cycleTimer) clearTimeout(cycleTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [matches, city, dismissed]);

  function dismiss() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
    }
    setDismissed(true);
    setCurrent(null);
    setScarcityVisible(false);
  }

  if (!mounted || dismissed) return null;
  if (!current && !scarcityVisible) return null;

  const visible = Boolean(current || scarcityVisible);

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        "fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-30 max-w-[300px] sm:max-w-[320px] " +
        "transition-all duration-300 " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")
      }
    >
      <div className="bg-white border border-border rounded-xl shadow-[0_12px_30px_rgba(15,41,64,0.18)] px-4 py-3 flex gap-3 items-start">
        {current ? (
          <>
            <span className="relative flex-shrink-0 mt-1.5">
              <span className="block w-2 h-2 rounded-full bg-green-500" />
              <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-foreground leading-tight">
                {current.name} in {current.city}
              </div>
              <div className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                just got matched · {PROJECT_EMOJI[current.project] ?? "🔨"} {current.project}
              </div>
              {current.minsAgo <= SHOW_TIMESTAMP_MAX_MIN && (
                <div className="text-[11px] text-muted-foreground/80 mt-1">
                  {fuzzyTime(current.minsAgo)}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="text-base flex-shrink-0 mt-0.5">✨</span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-foreground leading-tight">
                New in your area
              </div>
              <div className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                Be one of the first homeowners in {city} to get matched.
              </div>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="flex-shrink-0 -mr-1 -mt-0.5 w-6 h-6 rounded hover:bg-secondary text-muted-foreground/60 hover:text-foreground flex items-center justify-center transition"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
