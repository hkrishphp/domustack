import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-primary to-accent py-20">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <h2 className="text-[28px] md:text-4xl font-medium text-white mb-3">
          Ready to Start Your Dream Project?
        </h2>
        <p className="text-base text-white/85 mb-8">
          Join thousands of homeowners who have successfully completed their renovations
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-primary rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition"
          >
            Get Started Free
          </Link>
          <Link
            href="/inspirations"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border-[1.5px] border-white/50 text-white rounded-[var(--radius)] text-[15px] font-medium hover:bg-white/10 transition"
          >
            Browse Inspirations
          </Link>
        </div>
      </div>
    </section>
  );
}
