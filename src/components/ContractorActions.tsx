"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { startConversation } from "@/lib/messaging";

export default function ContractorActions({
  contractorId,
  contractorName,
}: {
  contractorId: string;
  contractorName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"quote" | "message" | null>(null);

  async function handleAction(type: "quote" | "message") {
    setLoading(type);

    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/sign-in?redirectTo=/contractor/" + encodeURIComponent(contractorName));
      return;
    }

    const msg =
      type === "quote"
        ? `Hi ${contractorName}, I'd like to request a quote for a renovation project. Can you share pricing details?`
        : `Hi ${contractorName}, I'd like to discuss a potential project with you.`;

    const conversationId = await startConversation(
      supabase,
      user.id,
      contractorId,
      msg
    );

    setLoading(null);

    if (conversationId) {
      router.push(`/messages/${conversationId}`);
    }
  }

  return (
    <>
      <button
        onClick={() => handleAction("quote")}
        disabled={loading !== null}
        className="w-full py-3 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 mb-3"
      >
        {loading === "quote" ? "Please wait..." : "Request a Quote"}
      </button>
      <button
        onClick={() => handleAction("message")}
        disabled={loading !== null}
        className="w-full py-3 bg-secondary text-foreground rounded-[var(--radius)] text-[15px] font-medium hover:bg-secondary/80 transition disabled:opacity-50"
      >
        {loading === "message" ? "Please wait..." : "Send Message"}
      </button>
    </>
  );
}
