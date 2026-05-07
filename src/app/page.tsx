import type { Metadata } from "next";
import NavbarV1 from "@/components/v1/NavbarV1";
import HeroV1 from "@/components/v1/HeroV1";
import HowItWorksV1 from "@/components/v1/HowItWorksV1";
import GalleryV1 from "@/components/v1/GalleryV1";
import MissionV1 from "@/components/v1/MissionV1";
import ProjectFormV1 from "@/components/v1/ProjectFormV1";
import PricingStripV1 from "@/components/v1/PricingStripV1";
import TestimonialsV1 from "@/components/v1/TestimonialsV1";
import TrustBlockV1 from "@/components/v1/TrustBlockV1";
import FinalCTAV1 from "@/components/v1/FinalCTAV1";
import FooterV1 from "@/components/v1/FooterV1";

export const metadata: Metadata = {
  title: "Find Verified Renovation Contractors — Free Quotes in 24 Hours",
  description:
    "Get matched with up to 4 licensed, insured, background-checked renovation contractors near you. Kitchen, bath, roofing, additions, whole-home remodels — free quotes in 24 hours, no fees, no obligation.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Find Verified Renovation Contractors — Free Quotes in 24 Hours",
    description:
      "Match with up to 4 licensed, insured, background-checked contractors near you. Free quotes in 24 hours.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="theme-craftsman min-h-screen">
      <NavbarV1 />
      <main>
        <HeroV1 />
        <ProjectFormV1 />
        <HowItWorksV1 />
        <GalleryV1 />
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
