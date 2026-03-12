import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchKontraioServices } from "@/lib/kontraio";

export const dynamic = "force-dynamic";
import {
  getServiceLabel,
  getPropertyLabel,
  getBudgetLabel,
  getTimelineLabel,
} from "@/lib/service-areas";
import { formatDate } from "@/lib/utils";
import BidForm from "@/components/BidForm";
import type { Project } from "@/lib/supabase";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const [supabase, kontraioServices] = await Promise.all([
    createServerSupabaseClient(),
    fetchKontraioServices(),
  ]);

  const { data: project } = await supabase
    .from("projects")
    .select("*, users(full_name)")
    .eq("id", id)
    .single();

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
          <h1 className="text-4xl font-medium mb-4">Project Not Found</h1>
          <p className="text-muted-foreground text-lg">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
        </main>
      </>
    );
  }

  const p = project as Project;
  const services = (p.service_types || []) as string[];
  const beforePhotos = (p.photos || []) as string[];
  const expectedPhotos = (p.expected_photos || []) as string[];

  // Count existing bids
  const { count: bidCount } = await supabase
    .from("bids")
    .select("id", { count: "exact", head: true })
    .eq("project_id", id);

  // Check if current user is the project owner
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === p.user_id;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          {/* Back link */}
          <Link
            href="/projects/browse"
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column — project details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-2xl border border-border p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {services.map((slug) => (
                    <span
                      key={slug}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent"
                    >
                      {getServiceLabel(slug, kontraioServices)}
                    </span>
                  ))}
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/15 text-accent">
                    Open for Bids
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-2">{p.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Posted by {p.contact_first_name || "Homeowner"} on{" "}
                  {formatDate(p.created_at)} ·{" "}
                  {p.city}
                  {p.zip_code ? `, ${p.zip_code}` : ""}
                </p>
              </div>

              {/* Project info */}
              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="text-lg font-semibold mb-4">Project Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {p.property_type && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Property Type
                      </span>
                      <p className="text-sm font-medium mt-0.5">
                        {getPropertyLabel(p.property_type)}
                      </p>
                    </div>
                  )}
                  {p.budget_range && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Budget Range
                      </span>
                      <p className="text-sm font-medium mt-0.5">
                        {getBudgetLabel(p.budget_range)}
                      </p>
                    </div>
                  )}
                  {p.timeline && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Timeline
                      </span>
                      <p
                        className={`text-sm font-medium mt-0.5 ${
                          p.timeline === "emergency" ? "text-red-600" : ""
                        }`}
                      >
                        {getTimelineLabel(p.timeline)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {p.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {p.description}
                    </p>
                  </div>
                )}

                {/* Before / Current Photos */}
                {beforePhotos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Before / Current Photos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {beforePhotos.map((url, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-xl overflow-hidden border border-border"
                        >
                          <Image
                            src={url}
                            alt={`Before photo ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected / Inspiration Photos */}
                {expectedPhotos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Expected / Inspiration Photos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {expectedPhotos.map((url, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-xl overflow-hidden border border-border"
                        >
                          <Image
                            src={url}
                            alt={`Expected photo ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column — sidebar */}
            <div className="space-y-6">
              {/* Bid count */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {bidCount ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(bidCount ?? 0) === 1 ? "bid" : "bids"} received
                  </p>
                </div>
                {isOwner && (bidCount ?? 0) > 0 && (
                  <Link
                    href={`/projects/${id}/bids`}
                    className="block w-full mt-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold text-center hover:opacity-90 transition"
                  >
                    View All Bids
                  </Link>
                )}
              </div>

              {/* Bid form (only for non-owners when project is open) */}
              {!isOwner && p.status === "open" && (
                <BidForm projectId={p.id} projectName={p.name} />
              )}

              {/* Owner info */}
              {isOwner && (
                <div className="bg-white rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground">
                  <p>This is your project.</p>
                  <p className="mt-1">
                    Contractors will submit bids here. You&apos;ll be notified
                    when new bids arrive.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
