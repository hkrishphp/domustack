import NavbarV1 from "@/components/v1/NavbarV1";
import QuizHero from "@/components/v1/QuizHero";
import TrustBlockV1 from "@/components/v1/TrustBlockV1";
import TestimonialsV1 from "@/components/v1/TestimonialsV1";
import GalleryV1 from "@/components/v1/GalleryV1";
import HowItWorksV1 from "@/components/v1/HowItWorksV1";
import MissionV1 from "@/components/v1/MissionV1";
import FinalCTAV1 from "@/components/v1/FinalCTAV1";
import FooterV1 from "@/components/v1/FooterV1";

export default function HomeVariantC() {
  return (
    <div className="theme-craftsman min-h-screen bg-background">
      <NavbarV1 />
      <main>
        {/* Above the fold: lead-form quiz with warm cream + gold palette */}
        <QuizHero />

        {/* Supporting trust + content sections (navy/sage palette stays here) */}
        <TrustBlockV1 />
        <TestimonialsV1 />
        <GalleryV1 />
        <HowItWorksV1 />
        <MissionV1 />
        <FinalCTAV1 />
      </main>
      <FooterV1 />
    </div>
  );
}
