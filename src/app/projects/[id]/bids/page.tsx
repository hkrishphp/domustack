import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import BidActions from "@/components/BidActions";
import type { Bid } from "@/lib/supabase";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BidsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Fetch project & verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id, name, status, user_id")
    .eq("id", id)
    .single();

  if (!project || project.user_id !== user.id) {
    redirect("/projects");
  }

  // Fetch bids with contractor info
  const { data: bidsData } = await supabase
    .from("bids")
    .select("*, contractors(name, rating, reviews_count, location, image_url)")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const bids = (bidsData as Bid[] | null) ?? [];
  const pendingBids = bids.filter((b) => b.status === "pending");
  const otherBids = bids.filter((b) => b.status !== "pending");
  const isOpen = project.status === "open";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          {/* Back link */}
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
            Back to My Projects
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl border border-border p-8 mb-6">
            <h1 className="text-2xl font-bold mb-1">
              Bids for &quot;{project.name}&quot;
            </h1>
            <p className="text-sm text-muted-foreground">
              {bids.length} {bids.length === 1 ? "bid" : "bids"} received
              {isOpen
                ? " — Review and accept the best offer."
                : " — This project is no longer accepting bids."}
            </p>
          </div>

          {/* Empty state */}
          {bids.length === 0 && (
            <div className="text-center py-20">
              <svg
                className="mx-auto mb-4 text-muted-foreground"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h2 className="text-xl font-medium mb-2">No bids yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Contractors will submit their bids here. You&apos;ll be able to
                compare and accept the best offer.
              </p>
            </div>
          )}

          {/* Pending bids */}
          {pendingBids.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">
                Pending Bids ({pendingBids.length})
              </h2>
              <div className="flex flex-col gap-4">
                {pendingBids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    isOpen={isOpen}
                    projectId={id}
                    userId={user.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Accepted / Rejected bids */}
          {otherBids.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Past Bids ({otherBids.length})
              </h2>
              <div className="flex flex-col gap-4">
                {otherBids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    isOpen={false}
                    projectId={id}
                    userId={user.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function BidCard({
  bid,
  isOpen,
  projectId,
  userId,
}: {
  bid: Bid;
  isOpen: boolean;
  projectId: string;
  userId: string;
}) {
  const contractor = bid.contractors;
  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    accepted: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-600",
    withdrawn: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      {/* Contractor info + status */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-muted overflow-hidden flex items-center justify-center shrink-0">
            {contractor?.image_url ? (
              <Image
                src={contractor.image_url}
                alt={contractor.name}
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">
                {contractor?.name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold">{contractor?.name || "Contractor"}</p>
            <p className="text-xs text-muted-foreground">
              {contractor?.location || ""}
              {contractor?.rating
                ? ` · ${contractor.rating} stars (${contractor.reviews_count} reviews)`
                : ""}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[bid.status]}`}
        >
          {bid.status}
        </span>
      </div>

      {/* Bid details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Price Estimate
          </span>
          <p className="text-sm font-semibold mt-0.5">{bid.price_estimate}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Timeline
          </span>
          <p className="text-sm font-semibold mt-0.5">{bid.timeline}</p>
        </div>
      </div>

      {bid.description && (
        <div className="mb-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Approach
          </span>
          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">
            {bid.description}
          </p>
        </div>
      )}

      {bid.terms && (
        <div className="mb-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Terms
          </span>
          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
            {bid.terms}
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-4">
        Submitted {formatDate(bid.created_at)}
      </p>

      {/* Actions (only for pending bids on open projects) */}
      {isOpen && bid.status === "pending" && (
        <BidActions
          bidId={bid.id}
          projectId={projectId}
          contractorId={bid.contractor_id}
          userId={userId}
          contractorName={contractor?.name || "this contractor"}
        />
      )}
    </div>
  );
}
