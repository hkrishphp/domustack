const features = [
  {
    title: "Verified Contractors",
    description: "All contractors are background-checked and verified professionals",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "Milestone-based payments with buyer protection",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Real-time Updates",
    description: "Track project progress with live updates and messaging",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Quality Guaranteed",
    description: "Every project backed by our satisfaction guarantee",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] md:text-4xl font-medium mb-3">Why HomeRevive?</h2>
          <p className="text-base text-muted-foreground">
            Everything you need to plan, execute, and complete your home renovation project
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="text-center px-4 py-6">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
