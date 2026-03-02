"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createBrowserSupabaseClient, type Project } from "@/lib/supabase";

type ContractorOption = {
  id: string;
  name: string;
};

export default function EditProjectPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("planning");
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [contractors, setContractors] = useState<ContractorOption[]>([]);
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [existingBeforeUrl, setExistingBeforeUrl] = useState<string | null>(null);
  const [existingAfterUrl, setExistingAfterUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleImageChange(
    file: File | null,
    setFile: (f: File | null) => void,
    setPreview: (url: string | null) => void
  ) {
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFile(null);
      setPreview(null);
    }
  }

  useEffect(() => {
    async function loadData() {
      const supabase = createBrowserSupabaseClient();

      // Fetch contractors for dropdown
      const { data: contractorData } = await supabase
        .from("contractors")
        .select("id, name")
        .order("name");
      if (contractorData) setContractors(contractorData);

      // Fetch current project
      const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (project) {
        const p = project as any;
        setName(p.name);
        setDescription(p.description || "");
        setBudget(p.budget || "");
        setStartDate(p.start_date || "");
        setEndDate(p.end_date || "");
        setStatus(p.status);
        setProgress(p.progress);
        setContractorId(p.contractor_id || "");
        setExistingBeforeUrl(p.before_image_url || null);
        setExistingAfterUrl(p.after_image_url || null);
      }

      setPageLoading(false);
    }

    loadData();
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Upload new images if selected
    let beforeImageUrl = existingBeforeUrl;
    let afterImageUrl = existingAfterUrl;

    if (beforeImage) {
      const ext = beforeImage.name.split(".").pop();
      const path = `${user?.id || "anon"}/${Date.now()}-before.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("project-images")
        .upload(path, beforeImage);
      if (uploadErr) {
        setError("Failed to upload before image: " + uploadErr.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(path);
      beforeImageUrl = urlData.publicUrl;
    }

    if (afterImage) {
      const ext = afterImage.name.split(".").pop();
      const path = `${user?.id || "anon"}/${Date.now()}-after.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("project-images")
        .upload(path, afterImage);
      if (uploadErr) {
        setError("Failed to upload after image: " + uploadErr.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(path);
      afterImageUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        name: name.trim(),
        description: description.trim() || null,
        budget: budget.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        status,
        progress,
        contractor_id: contractorId || null,
        before_image_url: beforeImageUrl,
        after_image_url: afterImageUrl,
      })
      .eq("id", projectId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/projects");
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    const supabase = createBrowserSupabaseClient();

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
      return;
    }

    router.push("/projects");
    router.refresh();
  }

  if (pageLoading) {
    return (
      <>
        <Navbar />
        <main className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading project...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-card py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </Link>
            <h1 className="text-[32px] md:text-[48px] font-medium leading-tight mb-2">
              Edit Project
            </h1>
            <p className="text-muted-foreground text-lg">
              Update your project details, status, and progress.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-16">
          <div className="mx-auto max-w-[600px] px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>

              {/* Status & Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      if (e.target.value === "completed") setProgress(100);
                      if (e.target.value === "planning") setProgress(0);
                    }}
                    className="w-full px-4 py-3 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="progress"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Progress: {progress}%
                  </label>
                  <input
                    id="progress"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-2 mt-3 accent-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe your project — goals, scope, special requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-vertical"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="beforeImage"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Before Picture
                  </label>
                  <input
                    id="beforeImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(
                        e.target.files?.[0] || null,
                        setBeforeImage,
                        setBeforePreview
                      )
                    }
                    className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-[var(--radius)] file:border file:border-border file:text-sm file:font-medium file:bg-card file:text-foreground hover:file:bg-secondary/50 file:cursor-pointer file:transition"
                  />
                  {(beforePreview || existingBeforeUrl) && (
                    <img
                      src={beforePreview || existingBeforeUrl!}
                      alt="Before preview"
                      className="mt-3 w-full h-[150px] object-cover rounded-[var(--radius)] border border-border"
                    />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="afterImage"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    After / Expected Picture{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="afterImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(
                        e.target.files?.[0] || null,
                        setAfterImage,
                        setAfterPreview
                      )
                    }
                    className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-[var(--radius)] file:border file:border-border file:text-sm file:font-medium file:bg-card file:text-foreground hover:file:bg-secondary/50 file:cursor-pointer file:transition"
                  />
                  {(afterPreview || existingAfterUrl) && (
                    <img
                      src={afterPreview || existingAfterUrl!}
                      alt="After preview"
                      className="mt-3 w-full h-[150px] object-cover rounded-[var(--radius)] border border-border"
                    />
                  )}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Budget
                </label>
                <input
                  id="budget"
                  type="text"
                  placeholder="e.g., $25,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  />
                </div>
              </div>

              {/* Contractor */}
              <div>
                <label
                  htmlFor="contractor"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Contractor
                </label>
                <select
                  id="contractor"
                  value={contractorId}
                  onChange={(e) => setContractorId(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                >
                  <option value="">Unassigned</option>
                  {contractors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 rounded-[var(--radius)] p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <Link
                    href="/projects"
                    className="px-8 py-3 border border-border rounded-[var(--radius)] text-[15px] font-medium text-foreground hover:bg-secondary/50 transition"
                  >
                    Cancel
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-[var(--radius)] text-[15px] font-medium transition"
                >
                  Delete
                </button>
              </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                <div className="bg-card rounded-[var(--radius)] p-6 max-w-[400px] w-full shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    This will permanently delete &quot;{name}&quot;. This action cannot
                    be undone.
                  </p>
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-5 py-2.5 border border-border rounded-[var(--radius)] text-sm font-medium text-foreground hover:bg-secondary/50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-[var(--radius)] text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Delete Project"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
