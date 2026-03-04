"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type Props = {
  projectId: string;
  projectName: string;
};

export default function BidForm({ projectId, projectName }: Props) {
  const router = useRouter();
  const [priceEstimate, setPriceEstimate] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    // Find contractor record for this user
    const { data: contractor } = await supabase
      .from("contractors")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!contractor) {
      setError(
        "You must be registered as a contractor to submit bids. Please contact support."
      );
      setLoading(false);
      return;
    }

    const { error: bidError } = await supabase.from("bids").insert({
      project_id: projectId,
      contractor_id: contractor.id,
      price_estimate: priceEstimate.trim(),
      timeline: timeline.trim(),
      description: description.trim(),
      terms: terms.trim() || null,
    });

    if (bidError) {
      if (bidError.code === "23505") {
        setError("You have already submitted a bid for this project.");
      } else {
        setError(bidError.message);
      }
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
    router.refresh();
  }

  if (submitted) {
    return (
      <div className="bg-verified/10 border border-verified/20 rounded-xl p-6 text-center">
        <svg
          className="mx-auto mb-3"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#059669"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p className="text-verified font-semibold mb-1">Bid Submitted!</p>
        <p className="text-sm text-muted-foreground">
          The homeowner will review your bid for &quot;{projectName}&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Submit Your Bid</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Price Estimate <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={priceEstimate}
            onChange={(e) => setPriceEstimate(e.target.value)}
            placeholder="e.g., $12,000 - $15,000"
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Estimated Timeline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g., 3-4 weeks"
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Your Approach <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe how you would approach this project, materials, methodology..."
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition resize-vertical"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Terms & Conditions
          </label>
          <textarea
            rows={2}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Any terms, warranty info, payment schedule..."
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition resize-vertical"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Bid"}
        </button>
      </form>
    </div>
  );
}
