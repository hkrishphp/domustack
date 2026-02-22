import Navbar from "@/components/Navbar";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Contractor, ContractorService, Review } from "@/lib/supabase";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContractorPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const [
    { data: contractor },
    { data: services },
    { data: reviews },
  ] = await Promise.all([
    supabase.from("contractors").select("*").eq("id", id).single(),
    supabase.from("contractor_services").select("*").eq("contractor_id", id),
    supabase.from("reviews").select("*").eq("contractor_id", id).order("created_at", { ascending: false }),
  ]);

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
            {/* Left: Details */}
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

            {/* Right: Sidebar */}
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
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition mb-3">
                  Request a Quote
                </button>
                <button className="w-full py-3 bg-secondary text-foreground rounded-[var(--radius)] text-[15px] font-medium hover:bg-secondary/80 transition">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
