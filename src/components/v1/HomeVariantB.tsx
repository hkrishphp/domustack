"use client";

import Image from "next/image";
import NavbarV1 from "@/components/v1/NavbarV1";
import HowItWorksV1 from "@/components/v1/HowItWorksV1";
import GalleryV1 from "@/components/v1/GalleryV1";
import MissionV1 from "@/components/v1/MissionV1";
import PricingStripV1 from "@/components/v1/PricingStripV1";
import TestimonialsV1 from "@/components/v1/TestimonialsV1";
import TrustBlockV1 from "@/components/v1/TrustBlockV1";
import FinalCTAV1 from "@/components/v1/FinalCTAV1";
import FooterV1 from "@/components/v1/FooterV1";
import FloatingLeadForm from "@/components/v1/FloatingLeadForm";
import SocialProofTicker from "@/components/v1/SocialProofTicker";

// ─── Variant B palette: light slate + plum (Purple Heart tie-in) ──
const B_BG       = "#f3f1f5";
const B_INK      = "#1f1729";
const B_INK_SOFT = "#5e5466";
const B_PLUM     = "#7a4574";
const B_PLUM_DK  = "#5e3458";
const B_BORDER   = "#e0dae5";

function HeroVariantB() {
  return (
    <section
      className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden"
      style={{ background: B_BG }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${B_INK} 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div
            className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-6 border"
            style={{ background: "#fff", color: B_PLUM_DK, borderColor: B_BORDER }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: B_PLUM }} />
            Free · No fees · 24-hour quotes
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.04] tracking-tight mb-5"
            style={{ color: B_INK }}
          >
            Renovate without the
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">middle-man markup.</span>
              <span
                className="absolute left-0 right-0 bottom-1 h-3 -z-0"
                aria-hidden
                style={{ background: `${B_PLUM}25` }}
              />
            </span>
          </h1>
          <p
            className="text-lg lg:text-xl leading-relaxed mb-8 max-w-[560px]"
            style={{ color: B_INK_SOFT }}
          >
            Up to 4 verified, licensed, insured contractors competing for your job — and zero per-lead fees baked into your quote. Average savings: <strong style={{ color: B_INK }}>15–30%</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#project-form"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold !text-white transition active:scale-[0.98]"
              style={{ background: B_PLUM, boxShadow: `0 8px 28px ${B_PLUM}66` }}
            >
              Get free quotes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/cost-calculator"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold transition border"
              style={{ background: "#fff", color: B_INK, borderColor: B_BORDER }}
            >
              See cost calculator
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 items-center">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
                ].map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 overflow-hidden relative" style={{ borderColor: B_BG }}>
                    <Image src={src} alt="" fill className="object-cover" sizes="36px" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#eab308] text-sm font-bold">
                  ★★★★★ <span style={{ color: B_INK }}>4.8</span>
                </div>
                <div className="text-[12px]" style={{ color: B_INK_SOFT }}>12,400+ verified reviews</div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10" style={{ background: B_BORDER }} />
            <div>
              <div className="text-2xl font-bold leading-none" style={{ color: B_INK }}>10K+</div>
              <div className="text-[12px] mt-0.5" style={{ color: B_INK_SOFT }}>Verified pros</div>
            </div>
            <div>
              <div className="text-2xl font-bold leading-none" style={{ color: B_INK }}>50K+</div>
              <div className="text-[12px] mt-0.5" style={{ color: B_INK_SOFT }}>Projects done</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[28px] -z-10"
              style={{
                background: `linear-gradient(135deg, ${B_PLUM}26 0%, ${B_PLUM}10 100%)`,
              }}
            />
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden" style={{ boxShadow: `0 30px 80px ${B_INK}30` }}>
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern renovated home interior"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeVariantB() {
  return (
    <div className="theme-craftsman min-h-screen" style={{ background: B_BG }}>
      <NavbarV1 />
      <main>
        <HeroVariantB />
        <TrustBlockV1 />
        <GalleryV1 />
        <HowItWorksV1 />
        <MissionV1 />
        <PricingStripV1 />
        <TestimonialsV1 />
        <FinalCTAV1 />
      </main>
      <FooterV1 />
      <FloatingLeadForm variant="B" accentColor={B_PLUM} />
      <SocialProofTicker />
    </div>
  );
}
