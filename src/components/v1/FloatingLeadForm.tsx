"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { notifyLeadAction } from "@/app/actions/notify-lead";

const projectTypes = [
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Roofing",
  "Painting",
  "Whole Home Renovation",
  "Other",
];

const budgetRanges = [
  "Under $5K",
  "$5K – $15K",
  "$15K – $50K",
  "$50K – $100K",
  "$100K+",
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

export default function FloatingLeadForm({
  variant,
  accentColor = "#6b8e6b", // default sage; Variant B passes plum
}: {
  variant: string;
  accentColor?: string;
}) {
  // Open by default so the form is the first thing visitors see.
  const [open, setOpen] = useState(true);

  // Reopen the drawer when anything on the page links to #project-form.
  useEffect(() => {
    function onHash() {
      if (window.location.hash === "#project-form") {
        setOpen(true);
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Open quote form"
        onClick={() => setOpen(true)}
        className="fixed z-40 bottom-5 right-5 sm:bottom-6 sm:right-6 inline-flex items-center gap-2 px-5 py-3.5 rounded-full !text-white text-[14px] sm:text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition"
        style={{ background: accentColor, boxShadow: `0 12px 30px ${accentColor}73` }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Get Free Quote
      </button>

      {/* Backdrop (mobile only — desktop drawer is a side panel that doesn't block content) */}
      <div
        onClick={() => setOpen(false)}
        className={
          "sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity " +
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
      />

      {/* Drawer */}
      <aside
        className={
          "fixed z-50 bg-white shadow-[0_20px_60px_rgba(15,41,64,0.25)] " +
          // mobile: bottom sheet
          "left-0 right-0 bottom-0 max-h-[92vh] rounded-t-2xl " +
          // desktop: right side panel
          "sm:left-auto sm:top-0 sm:bottom-0 sm:right-0 sm:max-h-none sm:w-[440px] sm:rounded-t-none sm:rounded-l-2xl " +
          // animation
          "transition-transform duration-300 " +
          (open ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full")
        }
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase font-bold text-accent">Free quote</p>
            <h2 className="text-lg font-bold text-foreground">Tell us about your project</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-foreground/70 hover:text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 overflow-y-auto" style={{ maxHeight: "calc(92vh - 64px)" }}>
          <FormBody
            variant={variant}
            accentColor={accentColor}
            onDone={() => setTimeout(() => setOpen(false), 4000)}
          />
        </div>
      </aside>
    </>
  );
}

function FormBody({
  variant,
  accentColor,
  onDone,
}: {
  variant: string;
  accentColor: string;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [budget, setBudget] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let invalid = false;
    if (!isValidUSPhone(phone)) { setPhoneError("Enter a valid US phone number."); invalid = true; } else { setPhoneError(null); }
    if (!isValidEmail(email))   { setEmailError("Enter a valid email address.");   invalid = true; } else { setEmailError(null); }
    if (!isValidUSZip(zipCode)) { setZipError("5-digit US ZIP required.");         invalid = true; } else { setZipError(null); }
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
        description,
        budget_range: budget,
        inspiration_images: [] as string[],
        zip_code: zipCode.trim(),
      };
      const { error: insertErr } = await supabase.from("project_inquiries").insert(leadPayload);
      if (insertErr) throw insertErr;

      notifyLeadAction(leadPayload).catch((e) => console.warn("[notify-lead]", e));

      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      const params = { project_type: projectType, budget_range: budget, has_pictures: false, picture_count: 0 };
      w.gtag?.("event", "generate_lead", { ...params, variant });
      w.gtag?.("event", "conversion_event_submit_lead_form", { ...params, variant });
      try {
        posthog.identify(email, { email, name, phone, zip_code: zipCode });
        posthog.capture("lead_submitted", { ...params, variant, source: "floating_form" });
      } catch { /* noop */ }

      setSubmitted(true);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2f855a]/10 text-[#2f855a] mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">Thanks, {name || "there"}!</h3>
        <p className="text-muted-foreground text-sm">
          A Domustack specialist will reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Full name">
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
      </Field>
      <Field label="Phone" hint={phoneError ?? undefined} error={Boolean(phoneError)}>
        <input
          type="tel" required value={phone}
          onChange={(e) => { setPhone(formatUSPhone(e.target.value)); if (phoneError) setPhoneError(null); }}
          inputMode="tel" autoComplete="tel" maxLength={14} placeholder="(555) 123-4567"
          className={phoneError ? inputClassError : inputClass}
        />
      </Field>
      <Field label="Email" hint={emailError ?? undefined} error={Boolean(emailError)}>
        <input
          type="email" required value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
          autoComplete="email" placeholder="you@example.com"
          className={emailError ? inputClassError : inputClass}
        />
      </Field>
      <Field label="ZIP code" hint={zipError ?? undefined} error={Boolean(zipError)}>
        <input
          type="text" required value={zipCode}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d-]/g, "").slice(0, 10);
            setZipCode(v);
            if (zipError) setZipError(null);
          }}
          inputMode="numeric" autoComplete="postal-code" placeholder="78701"
          className={zipError ? inputClassError : inputClass}
        />
      </Field>
      <Field label="Project type">
        <select required value={projectType} onChange={(e) => setProjectType(e.target.value)} className={inputClass}>
          <option value="">Select…</option>
          {projectTypes.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Project description">
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          placeholder="What do you want done? Scope, timeline, materials…"
          className={`${inputClass} resize-y`}
        />
      </Field>
      <Field label="Budget range">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {budgetRanges.map((b) => {
            const active = budget === b;
            return (
              <button
                type="button" key={b} onClick={() => setBudget(b)}
                className="px-3 py-2 rounded-lg text-[12.5px] font-medium border transition !text-white"
                style={
                  active
                    ? { background: accentColor, color: "#fff", borderColor: accentColor }
                    : { background: "#fff", color: "var(--color-foreground, #1a1f2e)", borderColor: "var(--color-border, #dfe4ec)" }
                }
              >
                {b}
              </button>
            );
          })}
        </div>
      </Field>

      {error && (
        <div className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-800 text-[13px]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!budget || submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 !text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: accentColor, boxShadow: `0 4px 14px ${accentColor}66` }}
      >
        {submitting ? "Submitting…" : "Get my free quotes"}
      </button>

      <p className="text-[11px] text-muted-foreground text-center">
        Free, no obligation. We&apos;ll match you with up to 4 verified contractors in 24 hours.
      </p>
    </form>
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
