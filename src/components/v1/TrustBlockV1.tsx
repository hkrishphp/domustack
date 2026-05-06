const pillars = [
  {
    title: "Licensed",
    body: "Every pro's license is verified against state databases before they join.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
      </svg>
    ),
  },
  {
    title: "Insured",
    body: "Active general liability and workers' comp coverage required — we check yearly.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Background-checked",
    body: "Identity, criminal record, and business registration verified through trusted partners.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      </svg>
    ),
  },
  {
    title: "Reviewed",
    body: "Only homeowners who hired through Domustack can leave reviews — no fakes.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

export default function TrustBlockV1() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="bg-primary rounded-3xl px-8 py-14 md:px-14 md:py-20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <div className="max-w-[600px] mb-12">
              <p className="text-[#a8c0a4] font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
                Why Domustack
              </p>
              <h2 className="text-3xl md:text-[42px] font-bold tracking-tight text-white leading-[1.1] mb-4">
                Pros you can actually trust
              </h2>
              <p className="text-white/75 text-lg">
                Most marketplaces sell your info to whoever pays for it. We do the opposite —
                vet every contractor before they ever see your project.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((p) => (
                <div key={p.title}>
                  <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/15 text-[#a8c0a4] flex items-center justify-center mb-4">
                    {p.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-white/70 text-[14px] leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
