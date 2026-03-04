"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import {
  SERVICE_TYPES,
  PROPERTY_TYPES,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  CONTACT_METHODS,
  US_STATES,
  getServiceLabel,
  getPropertyLabel,
  getBudgetLabel,
  getTimelineLabel,
  getContactMethodLabel,
} from "@/lib/service-areas";

const STEPS = ["Service", "Details", "Location", "Review"];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Service & Property Type
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState("");

  // Step 2: Project Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beforePhotos, setBeforePhotos] = useState<File[]>([]);
  const [beforePreviews, setBeforePreviews] = useState<string[]>([]);
  const [expectedPhotos, setExpectedPhotos] = useState<File[]>([]);
  const [expectedPreviews, setExpectedPreviews] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");

  // Step 3: Location & Contact
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("");

  // ---- Service toggle ----
  function toggleService(slug: string) {
    setSelectedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  // ---- Photo handling ----
  function handlePhotoUpload(
    files: FileList | null,
    existing: File[],
    setFiles: (f: File[]) => void,
    setPreviews: (p: string[]) => void
  ) {
    if (!files) return;
    const newFiles = Array.from(files).filter(
      (f) =>
        (f.type === "image/jpeg" || f.type === "image/png") &&
        f.size <= 10 * 1024 * 1024
    );
    const totalFiles = [...existing, ...newFiles].slice(0, 5);
    setFiles(totalFiles);
    setPreviews(totalFiles.map((f) => URL.createObjectURL(f)));
  }

  function removePhoto(
    index: number,
    setFiles: (fn: (prev: File[]) => File[]) => void,
    setPreviews: (fn: (prev: string[]) => string[]) => void
  ) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // ---- Validation ----
  function validateStep(s: number): boolean {
    setError(null);
    if (s === 1) {
      if (selectedServices.length === 0) {
        setError("Please select at least one service type.");
        return false;
      }
      if (!propertyType) {
        setError("Please select a property type.");
        return false;
      }
    }
    if (s === 2) {
      if (!title.trim()) {
        setError("Project title is required.");
        return false;
      }
      if (!description.trim()) {
        setError("Project description is required.");
        return false;
      }
      if (beforePhotos.length === 0) {
        setError("Please upload at least one before / current photo.");
        return false;
      }
      if (!timeline) {
        setError("Please select a timeline.");
        return false;
      }
    }
    if (s === 3) {
      if (!streetAddress.trim()) {
        setError("Street address is required.");
        return false;
      }
      if (!city.trim()) {
        setError("City is required.");
        return false;
      }
      if (!zipCode.trim()) {
        setError("ZIP code is required.");
        return false;
      }
      if (!firstName.trim() || !lastName.trim()) {
        setError("First and last name are required.");
        return false;
      }
      if (!email.trim()) {
        setError("Email is required.");
        return false;
      }
      if (!phone.trim()) {
        setError("Phone is required.");
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (validateStep(step)) setStep(step + 1);
  }

  function goBack() {
    setError(null);
    setStep(step - 1);
  }

  function goToStep(s: number) {
    // Can only go back, not forward past validation
    if (s < step) {
      setError(null);
      setStep(s);
    }
  }

  // ---- Submit ----
  async function handleSubmit() {
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to create a project.");
      setLoading(false);
      return;
    }

    // Upload photos to Supabase storage
    async function uploadPhotos(files: File[], prefix: string): Promise<string[]> {
      const urls: string[] = [];
      for (const photo of files) {
        const ext = photo.name.split(".").pop();
        const path = `${user!.id}/${Date.now()}-${prefix}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("project-images")
          .upload(path, photo);
        if (uploadErr) throw new Error("Failed to upload photo: " + uploadErr.message);
        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(path);
        urls.push(urlData.publicUrl);
      }
      return urls;
    }

    let beforePhotoUrls: string[] = [];
    let expectedPhotoUrls: string[] = [];
    try {
      beforePhotoUrls = await uploadPhotos(beforePhotos, "before");
      expectedPhotoUrls = await uploadPhotos(expectedPhotos, "expected");
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("projects").insert({
      user_id: user.id,
      name: title.trim(),
      description: description.trim() || null,
      service_types: selectedServices,
      property_type: propertyType,
      budget_range: budgetRange || null,
      timeline,
      photos: beforePhotoUrls,
      expected_photos: expectedPhotoUrls,
      street_address: streetAddress.trim(),
      city: city.trim(),
      state: state || null,
      zip_code: zipCode.trim(),
      contact_first_name: firstName.trim(),
      contact_last_name: lastName.trim(),
      contact_email: email.trim(),
      contact_phone: phone.trim(),
      preferred_contact: contactMethod || null,
      status: "open",
      progress: 0,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Show success state
    setStep(5);
    setLoading(false);
  }

  // ---- Chip component ----
  function Chip({
    selected,
    onClick,
    children,
    urgent,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    urgent?: boolean;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
          selected
            ? urgent
              ? "border-red-500 bg-red-50 text-red-700"
              : "border-accent bg-accent/5 text-accent"
            : urgent
              ? "border-border bg-white text-red-600 hover:border-red-300"
              : "border-border bg-white text-foreground hover:border-accent/40"
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Progress Bar */}
        <div className="bg-white border-b border-border">
          <div className="mx-auto max-w-[700px] px-6 py-5">
            <div className="flex items-center justify-between">
              {STEPS.map((label, i) => {
                const stepNum = i + 1;
                const isActive = step === stepNum;
                const isDone = step > stepNum;
                return (
                  <button
                    key={label}
                    onClick={() => goToStep(stepNum)}
                    className={`flex items-center gap-2 text-sm font-medium transition ${
                      isActive
                        ? "text-accent"
                        : isDone
                          ? "text-primary cursor-pointer"
                          : "text-muted-foreground cursor-default"
                    }`}
                    disabled={stepNum > step}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive
                          ? "bg-accent text-white"
                          : isDone
                            ? "bg-primary text-white"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isDone ? "✓" : stepNum}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[700px] px-6 py-10">
          {/* ============================================ */}
          {/* STEP 1: Service & Property Type */}
          {/* ============================================ */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-border p-8">
              <h1 className="text-2xl font-bold mb-2">
                What type of work do you need?
              </h1>
              <p className="text-muted-foreground mb-8">
                Select all the service categories that apply to your project.
              </p>

              {/* Service Type */}
              <label className="block text-sm font-semibold mb-3">
                Service Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                {SERVICE_TYPES.map((svc) => (
                  <Chip
                    key={svc.slug}
                    selected={selectedServices.includes(svc.slug)}
                    onClick={() => toggleService(svc.slug)}
                  >
                    <span className="mr-1.5">{svc.icon}</span>
                    {svc.name}
                  </Chip>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-8">
                Select multiple if your project spans more than one trade.
              </p>

              {/* Property Type */}
              <label className="block text-sm font-semibold mb-3">
                Property Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PROPERTY_TYPES.map((pt) => (
                  <Chip
                    key={pt.slug}
                    selected={propertyType === pt.slug}
                    onClick={() => setPropertyType(pt.slug)}
                  >
                    <span className="mr-1.5">{pt.icon}</span>
                    {pt.name}
                  </Chip>
                ))}
              </div>

              {/* Error + Next */}
              {error && (
                <div className="mt-6 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}
              <div className="flex justify-end mt-8">
                <button
                  onClick={goNext}
                  className="px-8 py-3 bg-accent text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* STEP 2: Project Details */}
          {/* ============================================ */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-border p-8">
              <h1 className="text-2xl font-bold mb-2">
                Tell us about your project
              </h1>
              <p className="text-muted-foreground mb-8">
                The more detail you provide, the more accurate your quotes will
                be.
              </p>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g., "Kitchen sink replacement" or "Interior paint — 3 bedrooms"'
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scope of work including measurements, material preferences, known issues, and any constraints..."
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition resize-vertical"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include measurements, material preferences, and any
                  constraints contractors should know about.
                </p>
              </div>

              {/* Before / Current Photos */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">
                  Before / Current Photos <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Show the current state of the area — helps contractors understand the scope.
                </p>
                <div
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent/40 transition"
                  onClick={() =>
                    document.getElementById("before-photo-input")?.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-accent");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("border-accent");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-accent");
                    handlePhotoUpload(e.dataTransfer.files, beforePhotos, setBeforePhotos, setBeforePreviews);
                  }}
                >
                  <p className="text-sm font-medium text-foreground">
                    📷 Click to upload or drag photos here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG up to 10MB each · Max 5 photos
                  </p>
                </div>
                <input
                  id="before-photo-input"
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e.target.files, beforePhotos, setBeforePhotos, setBeforePreviews)}
                />
                {beforePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {beforePreviews.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`Before photo ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i, setBeforePhotos, setBeforePreviews)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-white rounded-full text-xs flex items-center justify-center hover:bg-red-500 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expected / Inspiration Photos */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">
                  Expected / Inspiration Photos{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Share reference images of the look or result you want to achieve.
                </p>
                <div
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent/40 transition"
                  onClick={() =>
                    document.getElementById("expected-photo-input")?.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-accent");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("border-accent");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-accent");
                    handlePhotoUpload(e.dataTransfer.files, expectedPhotos, setExpectedPhotos, setExpectedPreviews);
                  }}
                >
                  <p className="text-sm font-medium text-foreground">
                    📷 Click to upload or drag photos here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG up to 10MB each · Max 5 photos
                  </p>
                </div>
                <input
                  id="expected-photo-input"
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e.target.files, expectedPhotos, setExpectedPhotos, setExpectedPreviews)}
                />
                {expectedPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {expectedPreviews.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`Expected photo ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i, setExpectedPhotos, setExpectedPreviews)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-white rounded-full text-xs flex items-center justify-center hover:bg-red-500 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Budget Range
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUDGET_RANGES.map((b) => (
                    <Chip
                      key={b.value}
                      selected={budgetRange === b.value}
                      onClick={() => setBudgetRange(b.value)}
                    >
                      {b.label}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Timeline / Urgency <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIMELINE_OPTIONS.map((t) => (
                    <Chip
                      key={t.value}
                      selected={timeline === t.value}
                      onClick={() => setTimeline(t.value)}
                      urgent={t.urgent}
                    >
                      {t.label}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Error + Nav */}
              {error && (
                <div className="mt-6 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button
                  onClick={goBack}
                  className="px-6 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary/50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={goNext}
                  className="px-8 py-3 bg-accent text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* STEP 3: Location & Contact */}
          {/* ============================================ */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-border p-8">
              <h1 className="text-2xl font-bold mb-2">
                Project Location & Contact
              </h1>
              <p className="text-muted-foreground mb-8">
                Where is the work needed? How should contractors reach you?
              </p>

              {/* Street Address */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Project Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street address"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                >
                  <option value="">Select State</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6" style={{ maxWidth: "200px" }}>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.slice(0, 10))}
                  placeholder="ZIP Code"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                />
              </div>

              {/* Privacy notice */}
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                <span className="text-lg">🔒</span>
                <p className="text-sm text-foreground">
                  Your full address is hidden from contractors until you accept a
                  bid. Only your{" "}
                  <strong className="text-accent">city and ZIP code</strong>{" "}
                  will be shown so contractors can confirm you&apos;re within
                  their service area.
                </p>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                />
              </div>

              {/* Preferred Contact */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CONTACT_METHODS.map((cm) => (
                    <Chip
                      key={cm.value}
                      selected={contactMethod === cm.value}
                      onClick={() => setContactMethod(cm.value)}
                    >
                      <span className="mr-1">{cm.icon}</span>
                      {cm.label}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Error + Nav */}
              {error && (
                <div className="mt-6 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button
                  onClick={goBack}
                  className="px-6 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary/50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={goNext}
                  className="px-8 py-3 bg-accent text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition"
                >
                  Review →
                </button>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* STEP 4: Review & Submit */}
          {/* ============================================ */}
          {step === 4 && (
            <div className="bg-white rounded-2xl border border-border p-8">
              <h1 className="text-2xl font-bold mb-2">Review Your Project</h1>
              <p className="text-muted-foreground mb-8">
                Double-check everything before submitting. You can go back to
                edit any section.
              </p>

              {/* Service Section */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wide mb-3 pb-2 border-b border-border">
                  Service
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Type</span>
                    <span className="font-medium text-right">
                      {selectedServices.map(getServiceLabel).join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium">
                      {getPropertyLabel(propertyType)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Details Section */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wide mb-3 pb-2 border-b border-border">
                  Project Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-medium text-right">{title}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Description</span>
                    <p className="mt-1 text-foreground">{description}</p>
                  </div>
                  {budgetRange && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">
                        {getBudgetLabel(budgetRange)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-medium">
                      {getTimelineLabel(timeline)}
                    </span>
                  </div>
                  {beforePreviews.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Before / Current Photos</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {beforePreviews.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Before photo ${i + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {expectedPreviews.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Expected / Inspiration Photos</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {expectedPreviews.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Expected photo ${i + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location & Contact Section */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wide mb-3 pb-2 border-b border-border">
                  Location & Contact
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-right">
                      {streetAddress}, {city}
                      {state ? `, ${state}` : ""} {zipCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">
                      {firstName} {lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{phone}</span>
                  </div>
                  {contactMethod && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Preferred Contact
                      </span>
                      <span className="font-medium">
                        {getContactMethodLabel(contactMethod)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy reminder */}
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                <span className="text-lg">🔒</span>
                <p className="text-sm text-foreground">
                  Contractors will only see your{" "}
                  <strong className="text-accent">
                    city, ZIP code, first name, and project details
                  </strong>{" "}
                  until you accept a bid.
                </p>
              </div>

              {/* Error + Nav */}
              {error && (
                <div className="mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={goBack}
                  className="px-6 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary/50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-verified text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Project →"}
                </button>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SUCCESS STATE */}
          {/* ============================================ */}
          {step === 5 && (
            <div className="bg-white rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 bg-verified/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-3">
                Project Submitted Successfully!
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                We&apos;re matching you with qualified contractors in your area.
                You&apos;ll receive bids within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/projects"
                  className="px-8 py-3 bg-primary text-white rounded-xl text-[15px] font-semibold hover:opacity-90 transition"
                >
                  View My Projects
                </Link>
                <button
                  onClick={() => {
                    // Reset form
                    setStep(1);
                    setSelectedServices([]);
                    setPropertyType("");
                    setTitle("");
                    setDescription("");
                    setBeforePhotos([]);
                    setBeforePreviews([]);
                    setExpectedPhotos([]);
                    setExpectedPreviews([]);
                    setBudgetRange("");
                    setTimeline("");
                    setStreetAddress("");
                    setCity("");
                    setState("");
                    setZipCode("");
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPhone("");
                    setContactMethod("");
                    setError(null);
                  }}
                  className="px-8 py-3 border border-border rounded-xl text-[15px] font-medium text-foreground hover:bg-secondary/50 transition"
                >
                  Submit Another Project
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
