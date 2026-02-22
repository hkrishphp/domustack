import Navbar from "@/components/Navbar";
import Image from "next/image";

const categories = ["All", "Kitchen", "Bathroom", "Living Room", "Bedroom", "Exterior"];

const inspirations = [
  {
    title: "Modern Minimalist Kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    author: "Sarah Mitchell",
    likes: 234,
  },
  {
    title: "Rustic Farmhouse Bathroom",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
    author: "James Cooper",
    likes: 189,
  },
  {
    title: "Contemporary Living Space",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    author: "Emily Chen",
    likes: 312,
  },
  {
    title: "Scandinavian Bedroom Retreat",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
    author: "Michael Torres",
    likes: 156,
  },
  {
    title: "Luxury Master Bath",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    author: "Olivia Park",
    likes: 278,
  },
  {
    title: "Open Concept Kitchen & Dining",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    author: "David Kim",
    likes: 421,
  },
];

export default function InspirationsPage() {
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
              {categories.map((cat, i) => (
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
              {inspirations.map((item) => (
                <div
                  key={item.title}
                  className="bg-card rounded-[var(--radius)] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="relative h-[240px] overflow-hidden">
                    <Image
                      src={item.image}
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
