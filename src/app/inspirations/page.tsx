import Navbar from "@/components/Navbar";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { InspirationCategory, Inspiration } from "@/lib/supabase";

export default async function InspirationsPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: categories }, { data: inspirations }] = await Promise.all([
    supabase.from("inspiration_categories").select("*").order("name"),
    supabase
      .from("inspirations")
      .select("*, inspiration_categories(name)")
      .order("likes", { ascending: false }),
  ]);

  const catList = (categories as InspirationCategory[] | null) ?? [];
  const inspList = (inspirations as Inspiration[] | null) ?? [];
  const allCategories = ["All", ...catList.map((c) => c.name)];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-card py-16">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <h1 className="text-[32px] md:text-[48px] font-medium leading-tight mb-4">
              Get Inspired
            </h1>
            <p className="text-muted-foreground text-lg max-w-[560px] mx-auto mb-8">
              Browse thousands of renovation ideas from real projects completed by HomeRevive contractors.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {allCategories.map((cat, i) => (
                <button
                  key={cat}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                    i === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspList.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-[var(--radius)] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="relative h-[240px] overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                      <span>by {item.author}</span>
                      <span className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
