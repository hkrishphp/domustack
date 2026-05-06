const projects = [
  { name: "Kitchen Remodel", range: "$25K – $60K", icon: "🍳" },
  { name: "Bathroom Remodel", range: "$10K – $25K", icon: "🛁" },
  { name: "Roofing", range: "$8K – $20K", icon: "🏠" },
  { name: "Interior Painting", range: "$2K – $6K", icon: "🎨" },
  { name: "Hardwood Flooring", range: "$6K – $15K", icon: "🪵" },
  { name: "Deck & Patio", range: "$5K – $18K", icon: "🪴" },
];

export default function PricingStripV1() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-[680px] mx-auto text-center mb-14">
          <p className="text-accent font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
            Transparent Pricing
          </p>
          <h2 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            Know what to expect before you commit
          </h2>
          <p className="text-muted-foreground text-lg">
            Real pricing ranges based on 50,000+ completed projects across the US — no surprise fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.name}
              className="group flex items-center gap-4 bg-white border border-border rounded-xl p-5 hover:border-accent/40 hover:shadow-[0_8px_24px_rgba(15,41,64,0.06)] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                {p.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-[15px]">{p.name}</h3>
                <p className="text-muted-foreground text-[13px]">Typical range</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">{p.range}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[13px] text-muted-foreground mt-8">
          * Pricing varies by region, materials, and scope. Get an exact quote in 24 hours.
        </p>
      </div>
    </section>
  );
}
