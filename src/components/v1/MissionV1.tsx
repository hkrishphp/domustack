export default function MissionV1() {
  return (
    <section id="mission" className="py-24 bg-primary text-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6">
        <div className="max-w-[720px] mb-14">
          <p className="text-white/60 font-semibold text-[13px] tracking-[0.2em] uppercase mb-4">
            Our Mission
          </p>
          <h2 className="text-3xl md:text-[44px] font-bold tracking-tight leading-[1.1] mb-6">
            Built for homeowners.<br />
            <span className="text-white/70">Not for lead farms.</span>
          </h2>
          <p className="text-white/85 text-lg lg:text-xl leading-relaxed">
            Other platforms charge contractors <strong className="text-white">$50–$200 every time they read your project</strong>.
            That tax doesn&apos;t disappear — it lands in your quote.
            Domustack charges <strong className="text-white">$0 per lead</strong>, so contractors compete on craft, not on recouping ad spend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-7">
            <div className="flex items-center gap-2 mb-4 text-white/60 text-[12px] font-semibold tracking-[0.15em] uppercase">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Other platforms
            </div>
            <ul className="space-y-3 text-white/80 text-[15px] leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                Contractors pay $50–$200 per lead, before saying hello
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                Bids get padded to cover ad spend &amp; pay-to-play exposure
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                Your $50K renovation quietly subsidizes their lead pipeline
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/20 p-7 ring-1 ring-white/10">
            <div className="flex items-center gap-2 mb-4 text-white text-[12px] font-semibold tracking-[0.15em] uppercase">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Domustack
            </div>
            <ul className="space-y-3 text-white text-[15px] leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                $0 per lead. Contractors keep their full margin.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                Quotes reflect the work, not the platform tax.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                Homeowners typically save 15–30% on the same scope.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-white/70 text-[14px] max-w-[640px] leading-relaxed">
            <strong className="text-white">How we make money:</strong> optional premium tools for contractors who want extra exposure — never from your project, never from selling your information.
          </p>
          <a
            href="#project-form"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary rounded-xl text-[15px] font-semibold hover:bg-white/90 active:scale-[0.98] transition shadow-[0_8px_28px_rgba(255,255,255,0.15)] whitespace-nowrap"
          >
            Get an honest quote
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
