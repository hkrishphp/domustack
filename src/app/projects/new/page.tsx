"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { startConversation } from "@/lib/messaging";

type ContractorOption = {
  id: string;
  name: string;
};

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [contractors, setContractors] = useState<ContractorOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchContractors() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from("contractors")
        .select("id, name")
        .order("name");
      if (data) setContractors(data);
    }
    fetchContractors();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

    const { error: insertError } = await supabase.from("projects").insert({
      user_id: user.id,
      name: name.trim(),
      budget: budget.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      contractor_id: contractorId || null,
      status: "planning",
      progress: 0,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Auto-create conversation with contractor if one was selected
    if (contractorId) {
      const budgetText = budget.trim() ? ` (Budget: ${budget.trim()})` : "";
      const message = `Hi, I've created a new project: ${name.trim()}${budgetText}. I'd like to discuss this with you.`;
      await startConversation(supabase, user.id, contractorId, message);
    }

    router.push("/projects");
    router.refresh();
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
              New Project
            </h1>
            <p className="text-muted-foreground text-lg">
              Create a new renovation project to track progress and manage
              details.
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
                  placeholder="e.g., Kitchen Remodel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
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
                  <option value="">Select a contractor (optional)</option>
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
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Project"}
                </button>
                <Link
                  href="/projects"
                  className="px-8 py-3 border border-border rounded-[var(--radius)] text-[15px] font-medium text-foreground hover:bg-secondary/50 transition"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
