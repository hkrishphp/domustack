import Navbar from "@/components/Navbar";
import ContractorActions from "@/components/ContractorActions";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Contractor, ContractorService, Review } from "@/lib/supabase";
import { fetchKontraioContractors } from "@/lib/kontraio";
import { getGoogleReviewsForContractor } from "@/lib/google-places";
import GoogleReviews from "@/components/GoogleReviews";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ContractorPage({ params }: Props) {
  const { slug } = await params;
  const isKontraio = slug.startsWith("k-");

  if (isKontraio) {
    return <KontraioContractorPage slug={slug} />;
  }

  // --- Domustack contractor (existing logic) ---
  const supabase = await createServerSupabaseClient();

  const { data: contractor } = await supabase
    .from("contractors")
    .select("*")
    .eq("slug", slug)
    .single();

  const contractorId = contractor?.id;
  const [{ data: services }, { data: reviews }] = contractorId
    ? await Promise.all([
        supabase.from("contractor_services").select("*").eq("contractor_id", contractorId),
        supabase.from("reviews").select("*").eq("contractor_id", contractorId).order("created_at", { ascending: false }),
      ])
    : [{ data: null }, { data: null }];

  if (!contractor) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
          <h1 className="text-4xl font-medium mb-4">Contractor Not Found</h1>
          <p className="text-muted-foreground text-lg">The contractor you&apos;re looking for doesn&apos;t exist.</p>
        </main>
      </>
    );
  }

  const c = contractor as Contractor;
  const svcList = (services as ContractorService[] | null) ?? [];
  const revList = (reviews as Review[] | null) ?? [];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[300px] overflow-hidden">
          <Image
            src={c.image_url || "https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"}
            alt={c.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-medium text-white">{c.name}</h1>
                <span className="bg-verified text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified
                </span>
              </div>
              <p className="text-white/80">{c.specialty}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-medium mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{c.description}</p>

              <h2 className="text-2xl font-medium mb-4">Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {svcList.map((service) => (
                  <div key={service.id} className="flex items-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {service.service_name}
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-medium mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {revList.map((review) => (
                  <div key={review.id} className="bg-card rounded-[var(--radius)] p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-rating font-semibold text-sm">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="text-sm font-medium">{review.reviewer_name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-card rounded-[var(--radius)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-rating font-semibold text-lg">&#9733; {c.rating}</span>
                  <span className="text-muted-foreground text-sm">({c.reviews_count} reviews)</span>
                </div>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {c.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 3v18" />
                      <path d="M3 9h6" />
                    </svg>
                    {c.projects_count} completed projects
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Price range: {c.price_range}
                  </div>
                </div>
                <ContractorActions contractorId={c.id} contractorName={c.name} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// --- Kontraio contractor profile ---
async function KontraioContractorPage({ slug }: { slug: string }) {
  const allKontraio = await fetchKontraioContractors();
  const contractor = allKontraio.find(
    (k) => `k-${k.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}` === slug
  );

  if (!contractor) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
          <h1 className="text-4xl font-medium mb-4">Contractor Not Found</h1>
          <p className="text-muted-foreground text-lg">The contractor you&apos;re looking for doesn&apos;t exist.</p>
        </main>
      </>
    );
  }

  // Fetch Google reviews for this contractor
  const googleData = await getGoogleReviewsForContractor(
    contractor.id,
    contractor.name,
    contractor.location
  );

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[300px] overflow-hidden bg-gradient-to-r from-primary/20 to-primary/5">
          {contractor.logo_url ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={contractor.logo_url}
                alt={contractor.name}
                width={120}
                height={120}
                className="rounded-[var(--radius)] object-contain"
                priority
              />
            </div>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-medium text-white">{contractor.name}</h1>
                {contractor.license_number && (
                  <span className="bg-verified text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Licensed
                  </span>
                )}
              </div>
              <p className="text-white/80">{contractor.location}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {/* Owner Info */}
              {contractor.owner_name && (
                <div className="flex items-center gap-3 mb-8 p-4 bg-card rounded-[var(--radius)] border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                    {contractor.owner_avatar ? (
                      <Image
                        src={contractor.owner_avatar}
                        alt={contractor.owner_name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary font-semibold">
                        {contractor.owner_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{contractor.owner_name}</p>
                    <p className="text-sm text-muted-foreground">{contractor.owner_title || "Owner"}</p>
                  </div>
                </div>
              )}

              {/* Services */}
              {contractor.services.length > 0 && (
                <>
                  <h2 className="text-2xl font-medium mb-4">Services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {contractor.services.map((service) => (
                      <div key={service} className="flex items-center gap-2 text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        {service}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <GoogleReviews
                reviews={googleData.reviews}
                rating={googleData.rating}
                totalReviews={googleData.userRatingsTotal}
                businessName={contractor.name}
              />
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-card rounded-[var(--radius)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sticky top-20">
                {googleData.hasMatch && googleData.rating !== null ? (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-rating font-semibold text-lg">&#9733; {googleData.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({googleData.userRatingsTotal} reviews on Google)</span>
                  </div>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-4 inline-block">
                    New on Domustack
                  </span>
                )}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {contractor.location}
                  </div>
                  {contractor.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {contractor.phone}
                    </div>
                  )}
                  {contractor.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      {contractor.email}
                    </div>
                  )}
                  {contractor.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition truncate">
                        {contractor.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {contractor.license_number && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M7 8h10" />
                        <path d="M7 12h6" />
                      </svg>
                      License: {contractor.license_number} ({contractor.license_state})
                    </div>
                  )}
                </div>
                {/* For Kontraio contractors, link to their website for quotes */}
                {contractor.website ? (
                  <a
                    href={contractor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition text-center"
                  >
                    Contact Contractor
                  </a>
                ) : contractor.email ? (
                  <a
                    href={`mailto:${contractor.email}`}
                    className="block w-full py-3 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition text-center"
                  >
                    Email Contractor
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
