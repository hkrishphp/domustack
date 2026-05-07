"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { notifyLeadAction } from "@/app/actions/notify-lead";

const projectTypes = [
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Roofing",
  "Flooring",
  "Painting",
  "Deck & Patio",
  "Whole Home Renovation",
  "Other",
];

const budgetRanges = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const inputClass =
  "w-full px-4 py-3 bg-background border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition";

const inputClassError =
  "w-full px-4 py-3 bg-background border border-red-400 rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-300/40 transition";

// Strip everything that isn't a digit; drop a leading "1" country code.
function digitsOnly(input: string): string {
  const d = input.replace(/\D/g, "");
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}

// Live formatter: "(555) 123-4567" as the user types.
function formatUSPhone(input: string): string {
  const d = digitsOnly(input).slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// NANP rules: 10 digits, area code & exchange both [2-9]xx.
function isValidUSPhone(input: string): boolean {
  const d = digitsOnly(input);
  if (d.length !== 10) return false;
  if (d[0] === "0" || d[0] === "1") return false;
  if (d[3] === "0" || d[3] === "1") return false;
  return true;
}

function isValidEmail(input: string): boolean {
  // RFC-pragmatic: local@domain.tld with at least one dot in domain, no spaces.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

// US ZIP: 5 digits, optionally followed by -4 ZIP+4. We only require 5.
function isValidUSZip(input: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(input.trim());
}

export default function ProjectFormV1() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState<File[]>([]);
  const [budget, setBudget] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setPictures(files);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let invalid = false;
    if (!isValidUSPhone(phone)) {
      setPhoneError("Enter a valid US phone number, e.g. (555) 123-4567.");
      invalid = true;
    } else {
      setPhoneError(null);
    }
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address.");
      invalid = true;
    } else {
      setEmailError(null);
    }
    if (!isValidUSZip(zipCode)) {
      setZipError("Enter a valid 5-digit US ZIP code.");
      invalid = true;
    } else {
      setZipError(null);
    }
    if (invalid) return;

    setSubmitting(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    let imageUrls: string[] = [];

    try {
      if (pictures.length > 0) {
        imageUrls = await Promise.all(
          pictures.map(async (file) => {
            const ext = file.name.split(".").pop() ?? "jpg";
            const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
            const { data, error: upErr } = await supabase.storage
              .from("project-inquiries")
              .upload(path, file, { contentType: file.type });
            if (upErr) throw upErr;
            const { data: pub } = supabase.storage
              .from("project-inquiries")
              .getPublicUrl(data.path);
            return pub.publicUrl;
          })
        );
      }

      const leadPayload = {
        full_name: name,
        phone,
        email,
        project_type: projectType,
        description,
        budget_range: budget,
        inspiration_images: imageUrls,
        street_address: streetAddress.trim(),
        city: city.trim(),
        state: stateCode,
        zip_code: zipCode.trim(),
      };

      const { error: insertErr } = await supabase
        .from("project_inquiries")
        .insert(leadPayload);

      if (insertErr) throw insertErr;

      // Fire-and-forget admin notification — don't block the success state.
      notifyLeadAction(leadPayload).catch((e) =>
        console.warn("[notify-lead] failed", e)
      );

      // GA4 + Google Ads conversion events — fire only after the row is safely persisted.
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      const params = {
        project_type: projectType,
        budget_range: budget,
        has_pictures: imageUrls.length > 0,
        picture_count: imageUrls.length,
      };
      w.gtag?.("event", "generate_lead", params);
      w.gtag?.("event", "conversion_event_submit_lead_form", params);

      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setError(`${msg} Please try again or contact us at mail@purpleheartpros.com.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="project-form" className="py-24 bg-secondary/40">
      <div className="mx-auto max-w-[920px] px-6">
        <div className="max-w-[680px] mx-auto text-center mb-12">
          <p className="text-accent font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
            Get a Free Estimate
          </p>
          <h2 className="text-3xl md:text-[40px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            Tell us about your project
          </h2>
          <p className="text-muted-foreground text-lg">
            Share a few details and we&apos;ll match you with vetted local contractors within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-border rounded-2xl p-10 text-center shadow-[0_12px_40px_rgba(15,41,64,0.06)]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2f855a]/10 text-[#2f855a] mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Thanks, {name || "there"}!</h3>
            <p className="text-muted-foreground">
              We&apos;ve received your project. A Domustack specialist will reach out shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-border rounded-2xl p-6 md:p-10 shadow-[0_12px_40px_rgba(15,41,64,0.06)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full name" required>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Doe"
                  className={inputClass}
                />
              </Field>

              <Field label="Phone" required hint={phoneError ?? "US numbers only — (555) 123-4567"} hintIsError={Boolean(phoneError)}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatUSPhone(e.target.value));
                    if (phoneError) setPhoneError(null);
                  }}
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={14}
                  placeholder="(555) 123-4567"
                  aria-invalid={Boolean(phoneError)}
                  className={phoneError ? inputClassError : inputClass}
                />
              </Field>

              <Field label="Email" required hint={emailError ?? undefined} hintIsError={Boolean(emailError)}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(emailError)}
                  className={emailError ? inputClassError : inputClass}
                />
              </Field>

              <Field label="Project type" required>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Select a project type…</option>
                  {projectTypes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="Street address" required>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                    autoComplete="street-address"
                    placeholder="123 Main St"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-6 gap-5">
                <div className="sm:col-span-3">
                  <Field label="City" required>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      autoComplete="address-level2"
                      placeholder="Austin"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-1">
                  <Field label="State" required>
                    <select
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      required
                      autoComplete="address-level1"
                      className={inputClass}
                    >
                      <option value="">--</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="ZIP code" required hint={zipError ?? undefined} hintIsError={Boolean(zipError)}>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => {
                        // keep digits + optional one dash, max 10 chars (12345-6789)
                        const v = e.target.value.replace(/[^\d-]/g, "").slice(0, 10);
                        setZipCode(v);
                        if (zipError) setZipError(null);
                      }}
                      required
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="78701"
                      maxLength={10}
                      aria-invalid={Boolean(zipError)}
                      className={zipError ? inputClassError : inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div className="md:col-span-2">
                <Field label="Project description" required>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us about scope, timeline, materials, and anything else that matters."
                    className={`${inputClass} resize-y`}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Inspiration pictures (optional)">
                  <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/40 transition">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-muted-foreground">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-sm text-muted-foreground">
                      {pictures.length > 0
                        ? `${pictures.length} file${pictures.length > 1 ? "s" : ""} selected`
                        : "Click to upload — JPG, PNG, up to 10 MB each"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFiles}
                      className="hidden"
                    />
                  </label>
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Budget range" required>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {budgetRanges.map((b) => {
                      const active = budget === b;
                      return (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={
                            "px-3 py-2.5 rounded-lg text-[13px] font-medium border transition text-center " +
                            (active
                              ? "bg-primary text-white border-primary shadow-[0_4px_14px_rgba(15,41,64,0.18)]"
                              : "bg-white text-foreground border-border hover:border-primary/40")
                          }
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                  {!budget && (
                    <input
                      type="hidden"
                      required
                      value=""
                      onChange={() => {}}
                    />
                  )}
                </Field>
              </div>
            </div>

            {error && (
              <div className="mt-6 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
              <p className="text-xs text-muted-foreground max-w-[420px]">
                By submitting, you agree to be contacted by up to 4 verified Domustack contractors. Free, no obligation.
              </p>
              <button
                type="submit"
                disabled={!budget || submitting}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition shadow-[0_4px_14px_rgba(107,142,107,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                {submitting ? "Submitting…" : "Submit project"}
                {!submitting && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  hintIsError,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  hintIsError?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-foreground mb-1.5">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </span>
      {children}
      {hint && (
        <span
          className={`block mt-1.5 text-[12px] ${
            hintIsError ? "text-red-600 font-medium" : "text-muted-foreground"
          }`}
        >
          {hint}
        </span>
      )}
    </label>
  );
}
