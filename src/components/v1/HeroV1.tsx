import Image from "next/image";

export default function HeroV1() {
  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden">
      <Image
        src="https://d9hhrg4mnvzow.cloudfront.net/try.northwest-homepros.com/home-renovation/58a0f62b-landing-page-icons-and-graphics-16_10j00e90j00co00000s028.png"
        alt="Verified renovation contractors working on a modern home interior"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2940]/95 via-[#0f2940]/85 to-[#0f2940]/40" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 w-full">
        <div className="max-w-[680px]">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-[13px] font-medium px-4 py-2 rounded-full mb-7 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#6b8e6b] animate-pulse" />
            Trusted by 50,000+ US homeowners
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[60px] font-bold leading-[1.05] text-white mb-6 tracking-tight">
            Verified contractors.
            <br />
            <span className="text-[#a8c0a4]">Free quotes in 24 hours.</span>
          </h1>
          <p className="text-lg lg:text-xl text-white/85 leading-relaxed mb-12 max-w-[560px]">
            Tell us about your project and we&apos;ll match you with up to 4 licensed
            and insured pros in your area. No fees. No obligation.
          </p>

          <div className="flex flex-wrap gap-x-10 gap-y-4 items-center">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
                ].map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden relative">
                    <Image src={src} alt="" fill className="object-cover" sizes="36px" />
                  </div>
                ))}
              </div>
              <div className="text-white">
                <div className="flex items-center gap-1 text-[#eab308] text-sm font-bold">
                  ★★★★★ <span className="text-white">4.8</span>
                </div>
                <div className="text-[12px] text-white/70">from 12,400+ reviews</div>
              </div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-[12px] text-white/70">Verified pros</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-[12px] text-white/70">Projects completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
