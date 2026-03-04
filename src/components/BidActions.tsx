"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { startConversation } from "@/lib/messaging";

type Props = {
  bidId: string;
  projectId: string;
  contractorId: string;
  userId: string;
  contractorName: string;
};

export default function BidActions({
  bidId,
  projectId,
  contractorId,
  userId,
  contractorName,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  async function handleAccept() {
    if (
      !confirm(
        `Accept bid from ${contractorName}? This will assign them to the project and reject all other pending bids.`
      )
    )
      return;

    setLoading("accept");
    const supabase = createBrowserSupabaseClient();

    // 1. Accept this bid
    await supabase
      .from("bids")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", bidId);

    // 2. Reject all other pending bids for this project
    await supabase
      .from("bids")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("project_id", projectId)
      .eq("status", "pending")
      .neq("id", bidId);

    // 3. Assign contractor to project and update status
    await supabase
      .from("projects")
      .update({
        contractor_id: contractorId,
        status: "planning",
      })
      .eq("id", projectId);

    // 4. Auto-create conversation
    await startConversation(
      supabase,
      userId,
      contractorId,
      `Hi ${contractorName}! I've accepted your bid. Let's discuss the project details and next steps.`
    );

    setLoading(null);
    router.refresh();
  }

  async function handleReject() {
    if (!confirm(`Reject bid from ${contractorName}?`)) return;

    setLoading("reject");
    const supabase = createBrowserSupabaseClient();

    await supabase
      .from("bids")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", bidId);

    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 pt-4 border-t border-border">
      <button
        onClick={handleAccept}
        disabled={loading !== null}
        className="flex-1 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
      >
        {loading === "accept" ? "Accepting..." : "Accept Bid"}
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="flex-1 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-50 active:scale-[0.98] transition disabled:opacity-50"
      >
        {loading === "reject" ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
}
