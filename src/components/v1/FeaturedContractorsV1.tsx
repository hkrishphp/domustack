import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Contractor } from "@/lib/supabase";

const fallbackImage =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80";

export default async function FeaturedContractorsV1() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("contractors")
    .select("*")
    .order("rating", { ascending: false })
    .limit(6);

  const contractors = (data as Contractor[] | null) ?? [];

  return (
    <section id="contractors" className="py-24 bg-secondary/40">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-[600px]">
            <p className="text-accent font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
              Top Professionals
            </p>
            <h2 className="text-3xl md:text-[44px] font-bold tracking-tight leading-[1.1] mb-3">
              Featured contractors near you
            </h2>
            <p className="text-muted-foreground text-lg">
              Hand-selected pros with verified credentials, real reviews, and proven craftsmanship.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-primary font-semibold text-[15px] hover:gap-3 transition-all"
          >
            View all contractors
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contractors.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              No contractors available yet — check back soon.
            </div>
          )}

          {contractors.map((c) => (
            <Link
              key={c.id}
              href={`/contractor/${c.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-border hover:border-accent/40 hover:shadow-[0_16px_48px_rgba(15,41,64,0.1)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-[220px] overflow-hidden bg-muted">
                <Image
                  src={c.image_url || fallbackImage}
                  alt={c.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-verified text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Verified
                  </span>
                  <span className="bg-white/95 backdrop-blur text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    Insured
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-foreground text-[12px] font-semibold px-2.5 py-1 rounded-full">
                  {c.price_range}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-[17px] font-bold text-foreground group-hover:text-accent transition">
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#eab308">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-foreground font-bold text-sm">{c.rating}</span>
                    <span className="text-muted-foreground text-[12px]">({c.reviews_count})</span>
                  </div>
                </div>
                <p className="text-[13px] text-muted-foreground mb-4">{c.specialty}</p>
                <div className="flex items-center justify-between text-[13px] pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="truncate">{c.location}</span>
                  </div>
                  <span className="text-muted-foreground font-medium">
                    {c.projects_count}+ projects
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
