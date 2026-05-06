"use client";

import { useState } from "react";

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

const inputClass =
  "w-full px-4 py-3 bg-background border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition";

export default function ProjectFormV1() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState<File[]>([]);
  const [budget, setBudget] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setPictures(files);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
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

              <Field label="Phone" required>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="(555) 123-4567"
                  className={inputClass}
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
              <p className="text-xs text-muted-foreground max-w-[420px]">
                By submitting, you agree to be contacted by up to 4 verified Domustack contractors. Free, no obligation.
              </p>
              <button
                type="submit"
                disabled={!budget}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition shadow-[0_4px_14px_rgba(107,142,107,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                Submit project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-foreground mb-1.5">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
