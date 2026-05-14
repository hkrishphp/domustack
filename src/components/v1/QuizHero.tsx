"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { notifyLeadAction } from "@/app/actions/notify-lead";
import { lookupZip } from "@/lib/zip-lookup";

// ─── Variant C palette: warm cream + soft gold (distinct from A/B navy+sage) ──
const C_BG       = "#fbf6ec";
const C_CARD_BG  = "#ffffff";
const C_INK      = "#2a1f17";        // dark coffee headlines
const C_INK_SOFT = "#6b5a48";        // warm sub-text
const C_GOLD     = "#bf9b5e";        // soft brushed gold accent
const C_GOLD_DK  = "#9a7a3f";        // hover/deep
const C_BORDER   = "#e8dcc7";

const PROJECT_TYPES = [
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Roofing",
  "Painting",
  "Flooring",
  "Whole Home Renovation",
  "Deck & Patio",
  "Other",
];

const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
];

const TIMELINES = [
  "ASAP",
  "1–3 months",
  "3–6 months",
  "Just exploring",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

// ── Validators ──
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

// text-base = 16px to keep iOS Safari from auto-zooming on focus
const inputBase =
  "w-full px-4 py-3 rounded-lg text-base outline-none transition border focus:ring-2";

function inputStyle(error: boolean): React.CSSProperties {
  return {
    background: C_BG,
    color: C_INK,
    borderColor: error ? "rgb(248,113,113)" : C_BORDER,
  };
}

export default function QuizHero() {
  const [projectType, setProjectType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [cityTouched, setCityTouched] = useState(false);
  const [stateTouched, setStateTouched] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [zipAutofilled, setZipAutofilled] = useState(false);
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  // Auto-detect ZIP from IP on mount.
  useEffect(() => {
    if (zipCode) return;
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { postal?: string; country_code?: string } | null) => {
        if (cancelled || !data) return;
        if (data.country_code === "US" && data.postal && /^\d{5}$/.test(data.postal)) {
          setZipCode(data.postal);
          setZipAutofilled(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fill city + state from a valid 5-digit ZIP whenever ZIP changes.
  // Skip a field only if the user has manually typed in it (touched flag).
  useEffect(() => {
    if (!/^\d{5}$/.test(zipCode)) return;
    if (cityTouched && stateTouched) return;
    let cancelled = false;
    lookupZip(zipCode).then((result) => {
      if (cancelled || !result) return;
      if (!cityTouched) setCity(result.city);
      if (!stateTouched) setStateCode(result.state);
    });
    return () => {
      cancelled = true;
    };
  }, [zipCode, cityTouched, stateTouched]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let invalid = false;
    if (!isValidUSPhone(phone)) { setPhoneError("Enter a valid US phone number, e.g. (555) 123-4567."); invalid = true; } else { setPhoneError(null); }
    if (!isValidEmail(email))   { setEmailError("Enter a valid email address.");                       invalid = true; } else { setEmailError(null); }
    if (!isValidUSZip(zipCode)) { setZipError("Enter a valid 5-digit US ZIP code.");                   invalid = true; } else { setZipError(null); }
    if (invalid) return;

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const leadPayload = {
        full_name: name,
        phone,
        email,
        project_type: projectType,
        description: description.trim() || `${projectType}. Timeline: ${timeline || "n/a"}. Budget: ${budget || "n/a"}.`,
        budget_range: budget,
        inspiration_images: [] as string[],
        street_address: streetAddress.trim(),
        city: city.trim(),
        state: stateCode,
        zip_code: zipCode.trim(),
        variant: "C",
      };

      const { error: insertErr } = await supabase
        .from("project_inquiries")
        .insert(leadPayload);
      if (insertErr) throw insertErr;

      notifyLeadAction(leadPayload).catch((err) => console.warn("[notify-lead]", err));

      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      const params = {
        project_type: projectType,
        budget_range: budget,
        timeline,
        has_pictures: false,
        picture_count: 0,
      };
      w.gtag?.("event", "generate_lead", { ...params, variant: "C" });
      w.gtag?.("event", "conversion_event_submit_lead_form", { ...params, variant: "C" });
      try {
        posthog.identify(email, { email, name, phone, city, state: stateCode, zip_code: zipCode });
        posthog.capture("lead_submitted", { ...params, variant: "C", source: "lead_form_warm" });
      } catch { /* analytics never breaks the page */ }

      setSubmitted(true);
    } catch (err) {
      setError(
        (err instanceof Error ? err.message : "Submission failed.") +
        " Please try again or email mail@purpleheartpros.com."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="project-form"
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
      style={{ background: C_BG }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${C_INK} 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-[820px] px-5 sm:px-6">
        <div className="text-center mb-7 sm:mb-9">
          <p
            className="font-semibold text-[12px] tracking-[0.2em] uppercase mb-3"
            style={{ color: C_GOLD_DK }}
          >
            Free · 60 seconds · No obligation
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-[48px] font-bold leading-[1.05] tracking-tight"
            style={{ color: C_INK }}
          >
            {submitted ? "You're matched." : "Get matched with verified contractors."}
          </h1>
          {!submitted && (
            <p
              className="mt-4 text-base sm:text-lg max-w-[560px] mx-auto"
              style={{ color: C_INK_SOFT }}
            >
              Fill out the form below — up to 4 vetted, licensed, insured contractors near you will reach out within 24 hours.
            </p>
          )}
        </div>

        {submitted ? (
          <div
            className="rounded-2xl p-8 text-center shadow-[0_30px_80px_rgba(42,31,23,0.12)]"
            style={{ background: C_CARD_BG, border: `1px solid ${C_BORDER}` }}
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: "rgba(47,133,90,0.1)", color: "#2f855a" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: C_INK }}>
              Thanks, {name}!
            </h3>
            <p style={{ color: C_INK_SOFT }}>
              We&apos;ve received your project. Up to 4 verified contractors near {zipCode} will reach out within 24 hours.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-5 sm:p-7 md:p-9 shadow-[0_30px_80px_rgba(42,31,23,0.12)]"
            style={{ background: C_CARD_BG, border: `1px solid ${C_BORDER}` }}
          >
            {/* ── Project type ── */}
            <Section title="What kind of project?">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PROJECT_TYPES.map((p) => (
                  <Chip
                    key={p}
                    active={projectType === p}
                    onClick={() => setProjectType(p)}
                  >
                    {p}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* ── Timeline ── */}
            <Section title="Timeline">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TIMELINES.map((t) => (
                  <Chip key={t} active={timeline === t} onClick={() => setTimeline(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* ── Budget ── */}
            <Section title="Budget">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {BUDGET_RANGES.map((b) => (
                  <Chip key={b} active={budget === b} onClick={() => setBudget(b)}>
                    {b}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* ── Contact ── */}
            <Section title="Your contact info">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name">
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className={inputBase}
                    style={inputStyle(false)}
                  />
                </Field>
                <Field label="Phone" hint={phoneError ?? undefined} error={Boolean(phoneError)}>
                  <input
                    type="tel" required value={phone}
                    onChange={(e) => { setPhone(formatUSPhone(e.target.value)); if (phoneError) setPhoneError(null); }}
                    inputMode="tel" autoComplete="tel" maxLength={14} placeholder="(555) 123-4567"
                    className={inputBase}
                    style={inputStyle(Boolean(phoneError))}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email" hint={emailError ?? undefined} error={Boolean(emailError)}>
                    <input
                      type="email" required value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                      autoComplete="email" placeholder="you@example.com"
                      className={inputBase}
                      style={inputStyle(Boolean(emailError))}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            {/* ── Address ── */}
            <Section title="Project address">
              <div className="grid grid-cols-1 gap-4">
                <Field label="Street address">
                  <input
                    type="text" required value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="123 Main St"
                    autoComplete="street-address"
                    className={inputBase}
                    style={inputStyle(false)}
                  />
                </Field>

                <div className="grid grid-cols-6 gap-3">
                  <div className="col-span-3">
                    <Field label="City">
                      <input
                        type="text" required value={city}
                        onChange={(e) => { setCity(e.target.value); setCityTouched(true); }}
                        placeholder="Austin"
                        autoComplete="address-level2"
                        className={inputBase}
                        style={inputStyle(false)}
                      />
                    </Field>
                  </div>
                  <div className="col-span-1">
                    <Field label="State">
                      <select
                        required value={stateCode}
                        onChange={(e) => { setStateCode(e.target.value); setStateTouched(true); }}
                        autoComplete="address-level1"
                        className={inputBase}
                        style={inputStyle(false)}
                      >
                        <option value="">--</option>
                        {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="ZIP" hint={zipError ?? (zipAutofilled ? "Auto-detected" : undefined)} error={Boolean(zipError)}>
                      <input
                        type="text" required value={zipCode}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^\d-]/g, "").slice(0, 10);
                          setZipCode(v);
                          if (zipAutofilled) setZipAutofilled(false);
                          if (zipError) setZipError(null);
                        }}
                        inputMode="numeric" autoComplete="postal-code" placeholder="78701"
                        className={inputBase}
                        style={inputStyle(Boolean(zipError))}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </Section>

            {/* ── Description (optional) ── */}
            <Section title="Project description" subtitle="(optional but helpful)">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Tell us scope, materials you have in mind, anything specific…"
                className={inputBase + " resize-y"}
                style={inputStyle(false)}
              />
            </Section>

            {/* ── Error banner ── */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={submitting || !projectType || !budget}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-[16px] font-bold tracking-tight transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: C_GOLD,
                color: "#fff",
                boxShadow: `0 12px 32px ${C_GOLD}66`,
              }}
            >
              {submitting ? "Submitting…" : "Submit & get matched"}
              {!submitting && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>

            <p className="text-[11.5px] text-center mt-4" style={{ color: C_INK_SOFT }}>
              By submitting, you agree to be contacted by up to 4 verified Domustack contractors.
              Free, no obligation. Never sold, never spammed.
            </p>
          </form>
        )}

        {/* Trust microcopy */}
        {!submitted && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px]" style={{ color: C_INK_SOFT }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: C_GOLD }} />
              12,400+ matches this month
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: C_GOLD }} />
              Licensed &amp; insured pros
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: C_GOLD }} />
              No fees, ever
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Small helpers (theme-scoped to Variant C) ──

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase" style={{ color: C_INK }}>
          {title}
        </h3>
        {subtitle && (
          <span className="text-[12px]" style={{ color: C_INK_SOFT }}>{subtitle}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-3 rounded-xl border text-center font-semibold transition text-[13px] sm:text-[13.5px] leading-tight"
      style={
        active
          ? { background: C_INK, color: "#fff", borderColor: C_INK }
          : { background: "#fff", color: C_INK, borderColor: C_BORDER }
      }
    >
      {children}
    </button>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold mb-1" style={{ color: C_INK }}>
        {label}
      </span>
      {children}
      {hint && (
        <span
          className={"block mt-1 text-[11.5px] " + (error ? "text-red-600 font-medium" : "")}
          style={!error ? { color: C_INK_SOFT } : undefined}
        >
          {hint}
        </span>
      )}
    </label>
  );
}
