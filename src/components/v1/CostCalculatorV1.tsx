"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";
import {
  estimate,
  formatUSD,
  type EstimateResult,
  type ProjectType,
  type Tier,
} from "@/lib/cost-estimator";

const inputClass =
  "w-full px-4 py-3 bg-background border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition";

const inputClassError =
  "w-full px-4 py-3 bg-background border border-red-400 rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-300/40 transition";

const PROJECT_TYPES: { id: ProjectType; label: string; emoji: string }[] = [
  { id: "bathroom", label: "Bathroom", emoji: "🛁" },
  { id: "kitchen", label: "Kitchen", emoji: "🍳" },
  { id: "roofing", label: "Roofing", emoji: "🏠" },
  { id: "painting", label: "Painting", emoji: "🎨" },
];

const TIERS: { id: Tier; label: string; sub: string }[] = [
  { id: "basic", label: "Basic", sub: "Builder-grade" },
  { id: "mid", label: "Mid-Range", sub: "Quality finishes" },
  { id: "premium", label: "Premium", sub: "Luxury / custom" },
];

const SIZE_LABEL: Record<ProjectType, { label: string; placeholder: string }> = {
  bathroom: { label: "Room size", placeholder: "50" },
  kitchen:  { label: "Room size", placeholder: "150" },
  roofing:  { label: "Roof area", placeholder: "1800" },
  painting: { label: "Home size", placeholder: "1500" },
};

function isValidUSZip(input: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(input.trim());
}

export default function CostCalculatorV1() {
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [tier, setTier] = useState<Tier>("mid"); // default Mid-Range
  const [zipCode, setZipCode] = useState("");
  const [zipAutofilled, setZipAutofilled] = useState(false);
  const [squareFeet, setSquareFeet] = useState("");

  // Auto-fill ZIP from the visitor's IP on first load (best-effort).
  // Skipped if they've already typed something; failures are silent.
  useEffect(() => {
    if (zipCode) return;
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { postal?: string; country_code?: string } | null) => {
        if (cancelled || !data) return;
        if (data.country_code !== "US") return;
        if (data.postal && /^\d{5}$/.test(data.postal)) {
          setZipCode(data.postal);
          setZipAutofilled(true);
        }
      })
      .catch(() => {
        /* ad blocker or rate limit — homeowner can type their own ZIP */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live estimate — only when we have enough to compute.
  const result: EstimateResult | null = useMemo(() => {
    if (!projectType || !isValidUSZip(zipCode)) return null;
    const sqft = squareFeet ? Number(squareFeet) : undefined;
    return estimate({
      projectType,
      tier,
      zipCode,
      squareFeet: sqft && sqft > 0 ? sqft : undefined,
    });
  }, [projectType, tier, zipCode, squareFeet]);

  const zipShownAsInvalid = zipCode.length > 0 && !isValidUSZip(zipCode);

  // Fire PostHog event once when result first becomes valid.
  const trackedRef = useRef(false);
  useEffect(() => {
    if (result && !trackedRef.current) {
      trackedRef.current = true;
      try {
        posthog.capture("cost_calculator_used", {
          project_type: projectType,
          tier,
          zip_code: zipCode,
          square_feet: squareFeet ? Number(squareFeet) : null,
          estimate_low: result.costLow,
          estimate_high: result.costHigh,
        });
      } catch {
        /* analytics never breaks the page */
      }
    }
  }, [result, projectType, tier, zipCode, squareFeet]);

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        {/* Form */}
        <form className="bg-white border border-border rounded-2xl p-5 sm:p-7 md:p-10 shadow-[0_12px_40px_rgba(15,41,64,0.06)]">
          {/* Project type */}
          <div className="mb-7">
            <label className="block text-[13px] font-semibold text-foreground mb-3">
              What kind of project? <span className="text-accent">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PROJECT_TYPES.map((p) => {
                const active = projectType === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setProjectType(p.id)}
                    className={
                      "px-4 py-4 rounded-xl border text-left transition flex items-center gap-3 " +
                      (active
                        ? "bg-primary !text-white border-primary shadow-[0_4px_14px_rgba(15,41,64,0.18)]"
                        : "bg-white text-foreground border-border hover:border-primary/40")
                    }
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="font-semibold">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ZIP + size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
            <label className="block">
              <span className="block text-[13px] font-semibold text-foreground mb-1.5">
                ZIP code <span className="text-accent">*</span>
              </span>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d-]/g, "").slice(0, 10);
                  setZipCode(v);
                  if (zipAutofilled) setZipAutofilled(false);
                }}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="78701"
                className={zipShownAsInvalid ? inputClassError : inputClass}
              />
              {zipShownAsInvalid ? (
                <span className="block mt-1.5 text-[12px] text-red-600 font-medium">
                  Enter a valid 5-digit US ZIP code.
                </span>
              ) : zipAutofilled ? (
                <span className="block mt-1.5 text-[12px] text-muted-foreground">
                  Auto-detected from your location — change if needed.
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="block text-[13px] font-semibold text-foreground mb-1.5">
                {projectType ? SIZE_LABEL[projectType].label : "Room size"}{" "}
                <span className="text-muted-foreground font-normal">(optional, sq ft)</span>
              </span>
              <input
                type="number"
                min={20}
                max={10000}
                value={squareFeet}
                onChange={(e) => setSquareFeet(e.target.value)}
                placeholder={projectType ? SIZE_LABEL[projectType].placeholder : "50"}
                className={inputClass}
              />
            </label>
          </div>

          {/* Quality tier */}
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-3">
              Quality tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TIERS.map((t) => {
                const active = tier === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTier(t.id)}
                    className={
                      "px-4 py-4 rounded-xl border text-left transition " +
                      (active
                        ? "bg-primary !text-white border-primary shadow-[0_4px_14px_rgba(15,41,64,0.18)]"
                        : "bg-white text-foreground border-border hover:border-primary/40")
                    }
                  >
                    <div className="font-semibold">{t.label}</div>
                    <div className={`text-[12px] mt-0.5 ${active ? "text-white/75" : "text-muted-foreground"}`}>
                      {t.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Estimate + Permits side-by-side */}
        {result ? (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <ResultPanel result={result} projectType={projectType as ProjectType} />
            </div>
            <div className="lg:col-span-2">
              <PermitsCard result={result} />
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-secondary/60 border border-border rounded-2xl px-5 sm:px-8 py-6 text-center">
            <p className="text-[12px] tracking-[0.2em] uppercase font-bold text-muted-foreground mb-2">
              Live estimate
            </p>
            <p className="text-foreground/80 text-[15px]">
              Pick a project type and enter your ZIP — your estimate &amp; permits checklist appear here automatically.
            </p>
          </div>
        )}

        {result && (
          <div className="mt-6">
            <CTAFooter />
          </div>
        )}
      </div>
    </section>
  );
}

function ResultPanel({
  result,
  projectType,
}: {
  result: EstimateResult;
  projectType: ProjectType;
}) {
  return (
    <div className="bg-primary !text-white rounded-2xl p-5 sm:p-7 md:p-9 shadow-[0_20px_60px_rgba(15,41,64,0.18)] relative overflow-hidden h-full">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative">
        <p className="text-[#a8c0a4] font-semibold text-[11px] sm:text-[12px] tracking-[0.2em] uppercase mb-2 sm:mb-3">
          Estimated {projectType} · {result.tierLabel}
        </p>
        <div className="text-[26px] sm:text-3xl md:text-[40px] font-bold tracking-tight leading-[1.05] mb-4">
          {formatUSD(result.costLow)} – {formatUSD(result.costHigh)}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-[13px] sm:text-[14px] text-white/80 mb-6">
          <span>
            Midpoint: <strong className="text-white">{formatUSD(result.costMid)}</strong>
          </span>
          <span>
            Typical timeline:{" "}
            <strong className="text-white">
              {result.timelineLowWeeks}–{result.timelineHighWeeks} weeks
            </strong>
          </span>
        </div>

        <div>
          <p className="text-[11px] sm:text-[12px] tracking-[0.15em] uppercase font-bold text-[#a8c0a4] mb-2 sm:mb-3">
            What this tier typically includes
          </p>
          <ul className="space-y-2">
            {result.inclusions.map((line) => (
              <li key={line} className="flex gap-3 text-[14px] sm:text-[14.5px] text-white/85">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#a8c0a4] flex-shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-[11px] sm:text-[12px] text-white/60">
          National-average pricing adjusted for your ZIP region and room size.
          Final quotes from contractors will vary based on site conditions and scope.
        </p>
      </div>
    </div>
  );
}

function PermitsCard({ result }: { result: EstimateResult }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 sm:p-7 md:p-9 shadow-[0_8px_30px_rgba(15,41,64,0.05)] h-full">
      <p className="text-accent font-semibold text-[11px] sm:text-[12px] tracking-[0.2em] uppercase mb-2 sm:mb-3">
        Permits typically required
      </p>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-5 tracking-tight">
        Permits &amp; inspections
      </h3>

      <ul className="space-y-3.5">
        {result.permits.map((p) => (
          <li key={p.name} className="flex gap-3 sm:gap-4">
            <span
              className={
                "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-bold " +
                (p.usuallyRequired
                  ? "bg-accent/15 text-accent"
                  : "bg-secondary text-muted-foreground")
              }
            >
              {p.usuallyRequired ? "✓" : "?"}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-foreground text-[14.5px] sm:text-[15px]">{p.name}</h4>
                <span
                  className={
                    "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase " +
                    (p.usuallyRequired
                      ? "bg-accent/10 text-accent"
                      : "bg-secondary text-muted-foreground")
                  }
                >
                  {p.usuallyRequired ? "Usually required" : "Sometimes required"}
                </span>
              </div>
              <p className="text-[13px] sm:text-[13.5px] text-muted-foreground leading-relaxed mt-1">
                {p.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[12px] text-muted-foreground border-t border-border pt-5">
        <strong className="text-foreground">Final word:</strong> permit requirements are set by your <em>local</em> building department and can vary by city. Your contractor will pull the right ones.
      </p>
    </div>
  );
}

function CTAFooter() {
  return (
    <div className="bg-secondary/60 border border-border rounded-2xl p-6 sm:p-7 text-center">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
        Want a real quote, not just an estimate?
      </h3>
      <p className="text-muted-foreground text-[14.5px] mb-5">
        Get matched with up to 4 verified contractors near you in 24 hours.
      </p>
      <a
        href="/#project-form"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent !text-white rounded-xl text-[15px] font-semibold hover:brightness-110 transition shadow-[0_4px_14px_rgba(107,142,107,0.4)]"
      >
        Get free quotes
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
