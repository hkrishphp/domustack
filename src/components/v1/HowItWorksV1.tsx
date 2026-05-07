const steps = [
  {
    n: "01",
    title: "Tell us about your project",
    body: "Share your vision in 60 seconds — service type, ZIP, and timeline. No account required.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Get matched with vetted pros",
    body: "We hand-pick up to 4 contractors near you — every one is licensed and insured.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Compare bids, hire with confidence",
    body: "Review side-by-side quotes, read verified reviews, message pros, and pick the right one — all on Domustack.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 7L9 18l-5-5" />
      </svg>
    ),
  },
];

export default function HowItWorksV1() {
  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-foreground, #1a1f2e) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6">
        <div className="max-w-[680px] mx-auto text-center mb-20">
          <p className="text-accent font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
            How Domustack Works
          </p>
          <h2 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            From idea to renovation in 3 steps
          </h2>
          <p className="text-muted-foreground text-lg">
            No retainers. No hourly billing. No contractor chasing. Free to use — always.
          </p>
        </div>

        <ol className="relative">
          <div
            aria-hidden
            className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent"
          />

          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <li
                key={step.n}
                className="relative grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 last:mb-0"
              >
                <span
                  aria-hidden
                  className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent ring-8 ring-background"
                />

                <div className={isLeft ? "md:order-1" : "md:order-2"}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-accent to-primary/40">
                      {step.n}
                    </span>
                    <span className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/5 text-primary">
                      {step.icon}
                    </span>
                  </div>
                </div>

                <div className={isLeft ? "md:order-2 md:text-left" : "md:order-1 md:text-right"}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-[460px] md:inline-block">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
}
