import NavbarV1 from "@/components/v1/NavbarV1";
import HeroV1 from "@/components/v1/HeroV1";
import HowItWorksV1 from "@/components/v1/HowItWorksV1";
import MissionV1 from "@/components/v1/MissionV1";
import ProjectFormV1 from "@/components/v1/ProjectFormV1";
import PricingStripV1 from "@/components/v1/PricingStripV1";
import TestimonialsV1 from "@/components/v1/TestimonialsV1";
import TrustBlockV1 from "@/components/v1/TrustBlockV1";
import FinalCTAV1 from "@/components/v1/FinalCTAV1";
import FooterV1 from "@/components/v1/FooterV1";

export default function Home() {
  return (
    <div className="theme-craftsman min-h-screen">
      <NavbarV1 />
      <main>
        <HeroV1 />
        <ProjectFormV1 />
        <HowItWorksV1 />
        <MissionV1 />
        <PricingStripV1 />
        <TestimonialsV1 />
        <TrustBlockV1 />
        <FinalCTAV1 />
      </main>
      <FooterV1 />
    </div>
  );
}
