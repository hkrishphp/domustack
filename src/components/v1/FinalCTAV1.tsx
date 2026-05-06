import Image from "next/image";

export default function FinalCTAV1() {
  return (
    <section className="relative py-28 overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
        alt="Beautifully renovated home"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2940]/95 via-[#0f2940]/85 to-[#0f2940]/60" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center">
        <p className="text-[#a8c0a4] font-semibold text-[13px] tracking-[0.15em] uppercase mb-4">
          Ready When You Are
        </p>
        <h2 className="text-4xl md:text-[52px] font-bold text-white leading-[1.1] tracking-tight mb-5 max-w-[800px] mx-auto">
          Your dream renovation starts with one form
        </h2>
        <p className="text-white/80 text-lg max-w-[560px] mx-auto mb-10">
          60 seconds to submit. 24 hours to receive quotes. Free to use, always.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#quote"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6b8e6b] text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition shadow-[0_8px_28px_rgba(107,142,107,0.5)]"
          >
            Get Free Quotes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#contractors"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl text-[15px] font-semibold hover:bg-white/15 transition"
          >
            Browse Contractors
          </a>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/60 text-[13px]">
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8c0a4" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            No fees
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8c0a4" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            No obligation
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8c0a4" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            No spam calls
          </span>
        </div>
      </div>
    </section>
  );
}
