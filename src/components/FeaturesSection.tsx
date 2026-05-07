const features = [
  {
    title: "Verified Contractors",
    description: "Every contractor is licensed and insured before joining our platform.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "Milestone-based payments with escrow protection. Only pay when you're satisfied with the work.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Real-time Tracking",
    description: "Get live updates, photos, and messages from your contractor as your project progresses.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Satisfaction Guaranteed",
    description: "Every project is backed by our guarantee. We resolve issues quickly if anything goes wrong.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-wide uppercase mb-3">Why Domustack</p>
          <h2 className="text-3xl md:text-[40px] font-bold tracking-tight mb-4">
            Everything You Need, In One Place
          </h2>
          <p className="text-muted-foreground text-lg max-w-[560px] mx-auto">
            From finding the right contractor to tracking your project — we make home renovation effortless.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-border rounded-2xl p-7 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-[17px] font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
