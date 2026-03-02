import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center">
        <h2 className="text-3xl md:text-[44px] font-bold text-white mb-4 tracking-tight">
          Ready to Start Your Dream Project?
        </h2>
        <p className="text-lg text-white/70 mb-10 max-w-[480px] mx-auto">
          Join 50,000+ homeowners who have successfully completed their renovations with Domustack.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-white rounded-xl text-[16px] font-semibold hover:brightness-110 active:scale-[0.98] transition shadow-lg"
          >
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/inspirations"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white rounded-xl text-[16px] font-semibold hover:bg-white/10 transition"
          >
            Browse Inspirations
          </Link>
        </div>
      </div>
    </section>
  );
}
