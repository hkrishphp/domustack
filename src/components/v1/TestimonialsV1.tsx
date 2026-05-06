import Image from "next/image";

const testimonials = [
  {
    quote:
      "Domustack matched me with three contractors in 18 hours. The quotes were $4K apart — choosing was easy. Kitchen done in 5 weeks, on budget.",
    name: "Jennifer M.",
    location: "Austin, TX",
    project: "Kitchen Remodel",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
  },
  {
    quote:
      "I was nervous about hiring online. The license verification and reviews on Domustack made the call easy. My pro showed up on day one ready to work.",
    name: "Marcus T.",
    location: "Charlotte, NC",
    project: "Roof Replacement",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    image:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80",
  },
  {
    quote:
      "The bid comparison view saved us weeks. We could see scope, timeline, and price side-by-side and pick the best fit — not just the cheapest.",
    name: "Priya & David L.",
    location: "Seattle, WA",
    project: "Bathroom Remodel",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80",
  },
];

export default function TestimonialsV1() {
  return (
    <section id="reviews" className="py-24 bg-secondary/40">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-[680px] mx-auto text-center mb-14">
          <p className="text-accent font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
            Real Homeowners
          </p>
          <h2 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            Renovations homeowners brag about
          </h2>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex text-[#eab308] text-lg">★★★★★</div>
            <span className="font-bold text-foreground">4.8</span>
            <span className="text-muted-foreground text-sm">· 12,400+ verified reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-[0_12px_40px_rgba(15,41,64,0.08)] transition-all"
            >
              <div className="relative h-[200px]">
                <Image
                  src={t.image}
                  alt={`${t.project} by ${t.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {t.project}
                </div>
              </div>
              <div className="p-6">
                <div className="flex text-[#eab308] text-sm mb-3">★★★★★</div>
                <p className="text-foreground leading-relaxed mb-5 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image src={t.avatar} alt="" fill className="object-cover" sizes="44px" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{t.name}</div>
                    <div className="text-muted-foreground text-[12px]">{t.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
