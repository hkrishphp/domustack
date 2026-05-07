"use client";

import { useMemo, useState } from "react";
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

const TIERS: { id: Tier; label: string; sub: string }[] = [
  { id: "basic", label: "Basic", sub: "Builder-grade" },
  { id: "mid", label: "Mid-Range", sub: "Quality finishes" },
  { id: "premium", label: "Premium", sub: "Luxury / custom" },
];

const PROJECT_TYPES: { id: ProjectType; label: string; emoji: string }[] = [
  { id: "bathroom", label: "Bathroom", emoji: "🛁" },
  { id: "kitchen", label: "Kitchen", emoji: "🍳" },
];

function isValidUSZip(input: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(input.trim());
}

export default function CostCalculatorV1() {
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [tier, setTier] = useState<Tier | "">("");
  const [zipCode, setZipCode] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [beforePhoto, setBeforePhoto] = useState<File | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const beforePreview = useMemo(
    () => (beforePhoto ? URL.createObjectURL(beforePhoto) : null),
    [beforePhoto]
  );
  const afterPreview = useMemo(
    () => (afterPhoto ? URL.createObjectURL(afterPhoto) : null),
    [afterPhoto]
  );

  const canCalculate =
    Boolean(projectType) && Boolean(tier) && isValidUSZip(zipCode);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUSZip(zipCode)) {
      setZipError("Enter a valid 5-digit US ZIP code.");
      return;
    }
    setZipError(null);
    if (!projectType || !tier) return;

    const sqft = squareFeet ? Number(squareFeet) : undefined;
    const r = estimate({ projectType, tier, zipCode, squareFeet: sqft && sqft > 0 ? sqft : undefined });
    setResult(r);

    try {
      posthog.capture("cost_calculator_used", {
        project_type: projectType,
        tier,
        zip_code: zipCode,
        square_feet: sqft ?? null,
        estimate_low: r.costLow,
        estimate_high: r.costHigh,
        has_before_photo: Boolean(beforePhoto),
        has_after_photo: Boolean(afterPhoto),
      });
    } catch {
      /* PostHog might be blocked — never let analytics break the page. */
    }

    // Smooth scroll to the result panel after render.
    setTimeout(() => {
      document.getElementById("estimate-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[960px] px-6">
        <form
          onSubmit={handleCalculate}
          className="bg-white border border-border rounded-2xl p-6 md:p-10 shadow-[0_12px_40px_rgba(15,41,64,0.06)]"
        >
          {/* Project type */}
          <div className="mb-7">
            <label className="block text-[13px] font-semibold text-foreground mb-3">
              What kind of project? <span className="text-accent">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-[420px]">
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
                        ? "bg-primary text-white border-primary shadow-[0_4px_14px_rgba(15,41,64,0.18)]"
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
                  if (zipError) setZipError(null);
                }}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="78701"
                className={zipError ? inputClassError : inputClass}
              />
              {zipError && (
                <span className="block mt-1.5 text-[12px] text-red-600 font-medium">{zipError}</span>
              )}
            </label>

            <label className="block">
              <span className="block text-[13px] font-semibold text-foreground mb-1.5">
                Room size <span className="text-muted-foreground font-normal">(optional, sq ft)</span>
              </span>
              <input
                type="number"
                min={20}
                max={1000}
                value={squareFeet}
                onChange={(e) => setSquareFeet(e.target.value)}
                placeholder={projectType === "kitchen" ? "150" : "50"}
                className={inputClass}
              />
            </label>
          </div>

          {/* Tier */}
          <div className="mb-7">
            <label className="block text-[13px] font-semibold text-foreground mb-3">
              Quality tier <span className="text-accent">*</span>
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
                        ? "bg-primary text-white border-primary shadow-[0_4px_14px_rgba(15,41,64,0.18)]"
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

          {/* Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
            <PhotoField label="Current photo (before)" file={beforePhoto} preview={beforePreview} onChange={setBeforePhoto} />
            <PhotoField label="Inspiration photo (desired look)" file={afterPhoto} preview={afterPreview} onChange={setAfterPhoto} />
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Photos are previewed locally on your device and used to give your matched contractor context — they don&apos;t affect the cost estimate yet.
          </p>

          <button
            type="submit"
            disabled={!canCalculate}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition shadow-[0_4px_14px_rgba(107,142,107,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            Calculate estimate
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>

        {result && (
          <div id="estimate-result" className="mt-10 space-y-6">
            <ResultCard result={result} projectType={projectType as ProjectType} />
            {(beforePreview || afterPreview) && (
              <PhotoPreviewRow before={beforePreview} after={afterPreview} />
            )}
            <PermitsCard result={result} />
            <CTAFooter />
          </div>
        )}
      </div>
    </section>
  );
}

function PhotoField({
  label,
  file,
  preview,
  onChange,
}: {
  label: string;
  file: File | null;
  preview: string | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-foreground mb-1.5">{label}</span>
      <div className="relative border border-dashed border-border rounded-xl overflow-hidden bg-secondary/20 hover:bg-secondary/40 transition cursor-pointer">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="w-full h-48 object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-muted-foreground text-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Click to upload</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <span className="block mt-1.5 text-[12px] text-muted-foreground">{file.name}</span>
      )}
    </label>
  );
}

function ResultCard({ result, projectType }: { result: EstimateResult; projectType: ProjectType }) {
  return (
    <div className="bg-primary text-white rounded-2xl p-7 md:p-10 shadow-[0_20px_60px_rgba(15,41,64,0.18)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />
      <div className="relative">
        <p className="text-accent font-semibold text-[12px] tracking-[0.2em] uppercase mb-3">
          Estimated cost — {projectType} · {result.tierLabel}
        </p>
        <div className="text-3xl md:text-[44px] font-bold tracking-tight leading-[1.05] mb-4">
          {formatUSD(result.costLow)} – {formatUSD(result.costHigh)}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-white/70 text-[13px] mb-6">
          <span>Midpoint: <strong className="text-white">{formatUSD(result.costMid)}</strong></span>
          <span>Region multiplier: <strong className="text-white">×{result.regionMultiplier.toFixed(2)}</strong></span>
          <span>Size multiplier: <strong className="text-white">×{result.sizeMultiplier.toFixed(2)}</strong></span>
        </div>

        <div>
          <p className="text-[12px] tracking-[0.15em] uppercase font-bold text-[#a8c0a4] mb-3">
            What this tier typically includes
          </p>
          <ul className="space-y-2">
            {result.inclusions.map((line) => (
              <li key={line} className="flex gap-3 text-[14.5px] text-white/85">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#a8c0a4] flex-shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-7 text-[12px] text-white/60 max-w-[640px]">
          Estimates are based on national-average data adjusted for your ZIP region and the room size you entered. Actual quotes from contractors will vary based on site conditions, materials, and scope.
        </p>
      </div>
    </div>
  );
}

function PhotoPreviewRow({ before, after }: { before: string | null; after: string | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PhotoCard label="Current" url={before} />
      <PhotoCard label="Inspiration" url={after} />
    </div>
  );
}

function PhotoCard({ label, url }: { label: string; url: string | null }) {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div className="relative h-56 bg-secondary">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">— no photo —</div>
        )}
        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
          {label}
        </span>
      </div>
    </div>
  );
}

function PermitsCard({ result }: { result: EstimateResult }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-7 md:p-10 shadow-[0_8px_30px_rgba(15,41,64,0.05)]">
      <p className="text-accent font-semibold text-[12px] tracking-[0.2em] uppercase mb-3">
        Permits typically required
      </p>
      <h3 className="text-2xl font-bold text-foreground mb-5 tracking-tight">
        Permits & inspections
      </h3>

      <ul className="space-y-3.5">
        {result.permits.map((p) => (
          <li key={p.name} className="flex gap-4">
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
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground text-[15px]">{p.name}</h4>
                <span className={
                  "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase " +
                  (p.usuallyRequired ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground")
                }>
                  {p.usuallyRequired ? "Usually required" : "Sometimes required"}
                </span>
              </div>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed mt-1">{p.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[12px] text-muted-foreground border-t border-border pt-5">
        <strong className="text-foreground">Final word:</strong> permit requirements are set by your <em>local</em> building department and can vary by city. Your contractor will pull the right ones — or contact your municipality&apos;s building / planning office for the official list.
      </p>
    </div>
  );
}

function CTAFooter() {
  return (
    <div className="bg-secondary/60 border border-border rounded-2xl p-7 text-center">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Want a real quote, not just an estimate?</h3>
      <p className="text-muted-foreground mb-5">
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
