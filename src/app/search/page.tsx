import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Contractor } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import SearchForm from "@/components/SearchForm";
import SortSelect from "@/components/SortSelect";

type SortField = "rating" | "reviews_count" | "projects_count";

const sortLabels: Record<SortField, string> = {
  rating: "Highest Rated",
  reviews_count: "Most Reviews",
  projects_count: "Most Projects",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; location?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const service = params.service || "";
  const location = params.location || "";
  const sort: SortField = (["rating", "reviews_count", "projects_count"] as SortField[]).includes(
    params.sort as SortField
  )
    ? (params.sort as SortField)
    : "rating";

  const supabase = await createServerSupabaseClient();

  // Find contractor IDs matching service name
  let matchedIds: string[] = [];
  if (service) {
    const { data: services } = await supabase
      .from("contractor_services")
      .select("contractor_id")
      .ilike("service_name", `%${service}%`);
    matchedIds = (services || []).map((s) => s.contractor_id);
  }

  // Build contractor query
  let query = supabase.from("contractors").select("*");

  if (service) {
    if (matchedIds.length > 0) {
      query = query.or(
        `name.ilike.%${service}%,specialty.ilike.%${service}%,id.in.(${matchedIds.join(",")})`
      );
    } else {
      query = query.or(
        `name.ilike.%${service}%,specialty.ilike.%${service}%`
      );
    }
  }

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  query = query.order(sort, { ascending: false });

  const { data: contractors } = await query;
  const results = (contractors as Contractor[] | null) || [];

  // Build filter removal URLs
  function removeFilterUrl(key: string) {
    const p = new URLSearchParams();
    if (key !== "service" && service) p.set("service", service);
    if (key !== "location" && location) p.set("location", location);
    if (sort !== "rating") p.set("sort", sort);
    const qs = p.toString();
    return `/search${qs ? `?${qs}` : ""}`;
  }

  return (
    <>
    <Navbar />
    <div className="py-10">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header with search form */}
        <div className="mb-8">
          <h1 className="text-[28px] md:text-4xl font-medium mb-4">
            {service || location ? "Search Results" : "All Contractors"}
          </h1>
          <div className="bg-card rounded-[var(--radius)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <SearchForm initialService={service} initialLocation={location} />
          </div>
        </div>

        {/* Filters & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "contractor" : "contractors"} found
            </span>
            {service && (
              <Link
                href={removeFilterUrl("service")}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full hover:opacity-80 transition"
              >
                Service: {service}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Link>
            )}
            {location && (
              <Link
                href={removeFilterUrl("location")}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full hover:opacity-80 transition"
              >
                Location: {location}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <SortSelect />
          </div>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((contractor) => (
              <Link
                key={contractor.id}
                href={`/contractor/${contractor.slug}`}
                className="bg-card rounded-[var(--radius)] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all"
              >
                {/* Image */}
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={
                      contractor.image_url ||
                      "https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                    }
                    alt={contractor.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-verified text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Verified
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-base font-semibold mb-1">{contractor.name}</h3>
                  <p className="text-[13px] text-muted-foreground mb-2.5">{contractor.specialty}</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-rating font-semibold text-sm">&#9733; {contractor.rating}</span>
                    <span className="text-muted-foreground text-[13px]">
                      ({contractor.reviews_count} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2.5 text-[13px]">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {contractor.location}
                    </div>
                    <span className="text-muted-foreground font-medium">{contractor.price_range}</span>
                  </div>
                  <div className="text-[13px] text-muted-foreground pt-2.5 border-t border-border">
                    {contractor.projects_count} completed projects
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
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
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
            <h2 className="text-xl font-medium mb-2">No contractors found</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn&apos;t find any contractors matching your search. Try adjusting your filters or browse all
              contractors.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition"
            >
              View All Contractors
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
