"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { notifyLeadAction } from "@/app/actions/notify-lead";
import {
  estimate,
  formatUSD,
  type ProjectType,
  type Tier,
  type EstimateResult,
} from "@/lib/cost-estimator";

const PROJECTS: { id: ProjectType; label: string; emoji: string }[] = [
  { id: "kitchen",  label: "Kitchen",  emoji: "🍳" },
  { id: "bathroom", label: "Bathroom", emoji: "🛁" },
  { id: "roofing",  label: "Roofing",  emoji: "🏠" },
  { id: "painting", label: "Painting", emoji: "🎨" },
];

const TIERS: { id: Tier; label: string; sub: string }[] = [
  { id: "basic",   label: "Basic",      sub: "Builder-grade · keep it simple" },
  { id: "mid",     label: "Mid-Range",  sub: "Quality finishes · most popular" },
  { id: "premium", label: "Premium",    sub: "Luxury · custom millwork" },
];

const TIMELINES = [
  { id: "ASAP",          label: "ASAP",          sub: "Ready to start now" },
  { id: "1-3 months",    label: "1–3 months",    sub: "Planning ahead" },
  { id: "3-6 months",    label: "3–6 months",    sub: "Researching options" },
  { id: "Just exploring", label: "Just exploring", sub: "No timeline yet" },
];

const inputClass =
  "w-full px-4 py-3 bg-background border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition";
const inputClassError =
  "w-full px-4 py-3 bg-background border border-red-400 rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-300/40 transition";

function digitsOnly(input: string): string {
  const d = input.replace(/\D/g, "");
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}
function formatUSPhone(input: string): string {
  const d = digitsOnly(input).slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
function isValidUSPhone(input: string): boolean {
  const d = digitsOnly(input);
  return d.length === 10 && d[0] !== "0" && d[0] !== "1" && d[3] !== "0" && d[3] !== "1";
}
function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}
function isValidUSZip(input: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(input.trim());
}

const STEPS = ["Project", "Location", "Quality", "Timeline", "Reveal"] as const;

export default function CalculatorQuiz() {
  const [step, setStep] = useState(0);

  const [project, setProject] = useState<ProjectType | "">("");
  const [zip, setZip] = useState("");
  const [zipAutofilled, setZipAutofilled] = useState(false);
  const [tier, setTier] = useState<Tier | "">("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  // Auto-detect ZIP from IP on first load.
  useEffect(() => {
    if (zip) return;
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { postal?: string; country_code?: string } | null) => {
        if (cancelled || !data) return;
        if (data.country_code === "US" && data.postal && /^\d{5}$/.test(data.postal)) {
          setZip(data.postal);
          setZipAutofilled(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function next() {
    if (step === 1 && !isValidUSZip(zip)) {
      setZipError("Enter a valid 5-digit US ZIP code.");
      return;
    }
    setZipError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function reveal() {
    let invalid = false;
    if (!isValidUSPhone(phone)) { setPhoneError("Enter a valid US phone number."); invalid = true; } else { setPhoneError(null); }
    if (!isValidEmail(email))   { setEmailError("Enter a valid email address.");   invalid = true; } else { setEmailError(null); }
    if (!name.trim()) invalid = true;
    if (invalid) return;

    setSubmitting(true);
    setError(null);

    try {
      const r = estimate({
        projectType: project as ProjectType,
        tier: (tier || "mid") as Tier,
        zipCode: zip,
      });

      const description = `Project: ${project}. Tier: ${tier || "mid"}. Timeline: ${timeline || "n/a"}. Estimate: ${formatUSD(r.costLow)} – ${formatUSD(r.costHigh)}.`;

      const supabase = createBrowserSupabaseClient();
      const leadPayload = {
        full_name: name,
        phone,
        email,
        project_type: project,
        description,
        budget_range: `${formatUSD(r.costLow)} – ${formatUSD(r.costHigh)}`,
        inspiration_images: [] as string[],
        zip_code: zip.trim(),
      };
      const { error: insertErr } = await supabase.from("project_inquiries").insert(leadPayload);
      if (insertErr) throw insertErr;

      notifyLeadAction(leadPayload).catch((e) => console.warn("[notify-lead]", e));

      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      const params = {
        project_type: project,
        tier: tier || "mid",
        timeline,
        budget_range: leadPayload.budget_range,
        has_pictures: false,
        picture_count: 0,
      };
      w.gtag?.("event", "generate_lead", { ...params, variant: "C" });
      w.gtag?.("event", "conversion_event_submit_lead_form", { ...params, variant: "C" });
      try {
        posthog.identify(email, { email, name, phone, zip_code: zip });
        posthog.capture("lead_submitted", { ...params, variant: "C", source: "calculator_quiz" });
      } catch { /* noop */ }

      setResult(r);
      setStep(STEPS.length); // beyond last step → reveal screen
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = (Math.min(step + 1, STEPS.length) / STEPS.length) * 100;

  return (
    <section className="bg-primary !text-white relative overflow-hidden py-12 sm:py-16 lg:py-20">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-[820px] px-5 sm:px-6">
        <div className="text-center mb-7 sm:mb-9">
          <p className="text-[#a8c0a4] font-semibold text-[12px] tracking-[0.2em] uppercase mb-3">
            Free · 60 seconds · No obligation
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-[50px] font-bold leading-[1.05] tracking-tight mb-4">
            {result ? "Your renovation estimate" : "Get a free estimate in 60 seconds"}
          </h1>
          {!result && (
            <p className="text-white/70 text-base sm:text-lg max-w-[560px] mx-auto">
              Answer 4 quick questions and we&apos;ll show your cost range, timeline, and the contractors who can do it.
            </p>
          )}
        </div>

        {!result && (
          <div className="bg-white text-foreground rounded-2xl p-5 sm:p-7 md:p-9 shadow-[0_30px_80px_rgba(15,41,64,0.25)]">
            {/* Progress */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center justify-between text-[11px] tracking-wider uppercase font-semibold text-muted-foreground mb-2">
                <span>{STEPS[Math.min(step, STEPS.length - 1)]}</span>
                <span>{Math.min(step + 1, STEPS.length)} / {STEPS.length}</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {step === 0 && (
              <Step
                title="What kind of project?"
                body={
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PROJECTS.map((p) => {
                      const active = project === p.id;
                      return (
                        <button
                          type="button" key={p.id}
                          onClick={() => { setProject(p.id); next(); }}
                          className={
                            "flex flex-col items-center gap-2 px-3 py-5 rounded-xl border transition " +
                            (active
                              ? "bg-primary !text-white border-primary"
                              : "bg-white text-foreground border-border hover:border-primary/40")
                          }
                        >
                          <span className="text-3xl">{p.emoji}</span>
                          <span className="text-[13px] font-semibold">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                }
              />
            )}

            {step === 1 && (
              <Step
                title="Where's the project?"
                body={
                  <div className="max-w-[300px]">
                    <input
                      type="text" autoFocus value={zip}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^\d-]/g, "").slice(0, 10);
                        setZip(v);
                        if (zipAutofilled) setZipAutofilled(false);
                        if (zipError) setZipError(null);
                      }}
                      inputMode="numeric" autoComplete="postal-code" placeholder="78701"
                      className={zipError ? inputClassError : inputClass}
                    />
                    {zipError ? (
                      <span className="block mt-1.5 text-[12px] text-red-600 font-medium">{zipError}</span>
                    ) : zipAutofilled ? (
                      <span className="block mt-1.5 text-[12px] text-muted-foreground">
                        Auto-detected from your location.
                      </span>
                    ) : (
                      <span className="block mt-1.5 text-[12px] text-muted-foreground">
                        We use this to match contractors near you.
                      </span>
                    )}
                  </div>
                }
              />
            )}

            {step === 2 && (
              <Step
                title="What quality are you aiming for?"
                body={
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TIERS.map((t) => {
                      const active = tier === t.id;
                      return (
                        <button
                          type="button" key={t.id}
                          onClick={() => { setTier(t.id); next(); }}
                          className={
                            "px-4 py-4 rounded-xl border text-left transition " +
                            (active
                              ? "bg-primary !text-white border-primary"
                              : "bg-white text-foreground border-border hover:border-primary/40")
                          }
                        >
                          <div className="font-semibold">{t.label}</div>
                          <div className={`text-[12px] mt-0.5 ${active ? "text-white/75" : "text-muted-foreground"}`}>{t.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                }
              />
            )}

            {step === 3 && (
              <Step
                title="When do you want to start?"
                body={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TIMELINES.map((t) => {
                      const active = timeline === t.id;
                      return (
                        <button
                          type="button" key={t.id}
                          onClick={() => { setTimeline(t.id); next(); }}
                          className={
                            "px-4 py-4 rounded-xl border text-left transition " +
                            (active
                              ? "bg-primary !text-white border-primary"
                              : "bg-white text-foreground border-border hover:border-primary/40")
                          }
                        >
                          <div className="font-semibold">{t.label}</div>
                          <div className={`text-[12px] mt-0.5 ${active ? "text-white/75" : "text-muted-foreground"}`}>{t.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                }
              />
            )}

            {step === 4 && (
              <Step
                title="Where should we send your estimate?"
                body={
                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Full name">
                      <input type="text" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
                    </Field>
                    <Field label="Phone" hint={phoneError ?? undefined} error={Boolean(phoneError)}>
                      <input
                        type="tel" value={phone}
                        onChange={(e) => { setPhone(formatUSPhone(e.target.value)); if (phoneError) setPhoneError(null); }}
                        inputMode="tel" autoComplete="tel" maxLength={14} placeholder="(555) 123-4567"
                        className={phoneError ? inputClassError : inputClass}
                      />
                    </Field>
                    <Field label="Email" hint={emailError ?? undefined} error={Boolean(emailError)}>
                      <input
                        type="email" value={email}
                        onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                        autoComplete="email" placeholder="you@example.com"
                        className={emailError ? inputClassError : inputClass}
                      />
                    </Field>

                    {error && (
                      <div className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">{error}</div>
                    )}

                    <button
                      type="button" onClick={reveal} disabled={!name || submitting}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent !text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition shadow-[0_4px_14px_rgba(107,142,107,0.4)] disabled:opacity-50"
                    >
                      {submitting ? "Calculating…" : "See my estimate"}
                      {!submitting && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>

                    <p className="text-[11px] text-muted-foreground text-center mt-1">
                      Your info is shared only with up to 4 verified contractors near you. Never sold, never spammed.
                    </p>
                  </div>
                }
              />
            )}

            {/* Back link */}
            {step > 0 && step < STEPS.length && (
              <div className="mt-6">
                <button type="button" onClick={back} className="text-[13px] text-muted-foreground hover:text-foreground transition flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trust microcopy */}
        {!result && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-white/65">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#a8c0a4]" />
              12,400+ matches this month
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#a8c0a4]" />
              Licensed & insured pros
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#a8c0a4]" />
              No fees, ever
            </span>
          </div>
        )}

        {/* Reveal panel */}
        {result && (
          <div className="space-y-5">
            <div className="bg-white text-foreground rounded-2xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(15,41,64,0.25)]">
              <p className="text-accent font-semibold text-[12px] tracking-[0.2em] uppercase mb-2">
                Your estimate · {project} · {result.tierLabel}
              </p>
              <div className="text-[28px] sm:text-4xl md:text-[44px] font-bold tracking-tight text-foreground mb-3 leading-none">
                {formatUSD(result.costLow)} – {formatUSD(result.costHigh)}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-[13px] sm:text-[14px] text-muted-foreground mb-5">
                <span>Midpoint: <strong className="text-foreground">{formatUSD(result.costMid)}</strong></span>
                <span>Typical timeline: <strong className="text-foreground">{result.timelineLowWeeks}–{result.timelineHighWeeks} weeks</strong></span>
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-[11px] tracking-[0.15em] uppercase font-bold text-muted-foreground mb-2">
                  What this tier typically includes
                </p>
                <ul className="space-y-1.5">
                  {result.inclusions.map((line) => (
                    <li key={line} className="flex gap-2 text-[14px] text-foreground/85">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">You&apos;re matched, {name}!</h3>
              <p className="text-white/85 text-[14.5px] max-w-[480px] mx-auto">
                Up to 4 verified contractors near {zip} will reach out within 24 hours with detailed quotes.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Step({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-5 tracking-tight">{title}</h2>
      {body}
    </div>
  );
}

function Field({
  label, hint, error, children,
}: { label: string; hint?: string; error?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold text-foreground mb-1">{label}</span>
      {children}
      {hint && <span className={"block mt-1 text-[11.5px] " + (error ? "text-red-600 font-medium" : "text-muted-foreground")}>{hint}</span>}
    </label>
  );
}
