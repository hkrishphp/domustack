import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Contractor } from "@/lib/supabase";

export default async function ContractorsSection() {
  const supabase = await createServerSupabaseClient();
  const { data: contractors } = await supabase
    .from("contractors")
    .select("*")
    .order("rating", { ascending: false })
    .limit(4);

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-accent font-semibold text-sm tracking-wide uppercase mb-3">Top Professionals</p>
            <h2 className="text-3xl md:text-[40px] font-bold tracking-tight mb-2">Featured Contractors</h2>
            <p className="text-muted-foreground text-lg">
              Trusted professionals ready to bring your vision to life
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-primary font-semibold text-[15px] hover:gap-3 transition-all"
          >
            View All Contractors
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(contractors as Contractor[] | null)?.map((contractor) => (
            <Link
              key={contractor.id}
              href={`/contractor/${contractor.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-[200px] overflow-hidden">
                <Image
                  src={contractor.image_url || "https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"}
                  alt={contractor.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-verified text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-[16px] font-semibold mb-1">{contractor.name}</h3>
                <p className="text-[13px] text-muted-foreground mb-3">{contractor.specialty}</p>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-rating font-bold text-sm">&#9733; {contractor.rating}</span>
                  <span className="text-muted-foreground text-[13px]">({contractor.reviews_count} reviews)</span>
                </div>
                <div className="flex items-center justify-between text-[13px] pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {contractor.location}
                  </div>
                  <span className="text-muted-foreground font-medium">{contractor.price_range}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
