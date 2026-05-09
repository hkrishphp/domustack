import type { Metadata } from "next";
import HomeVariantA from "@/components/v1/HomeVariantA";
import HomeVariantB from "@/components/v1/HomeVariantB";
import HomeVariantC from "@/components/v1/HomeVariantC";

export const metadata: Metadata = {
  title: "Find Verified Renovation Contractors — Free Quotes in 24 Hours",
  description:
    "Get matched with up to 4 licensed and insured renovation contractors near you. Kitchen, bath, roofing, additions, whole-home remodels — free quotes in 24 hours, no fees, no obligation.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Find Verified Renovation Contractors — Free Quotes in 24 Hours",
    description:
      "Match with up to 4 licensed and insured contractors near you. Free quotes in 24 hours.",
    url: "/",
    type: "website",
  },
};

// Local A/B/C testing helper. URL ?v=A|B|C selects a variant; default is A.
// Real cookie-based bucketing + PostHog Experiment will replace this once
// the variants are approved.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const params = await searchParams;
  const v = (params.v ?? "A").toUpperCase();
  if (v === "B") return <HomeVariantB />;
  if (v === "C") return <HomeVariantC />;
  return <HomeVariantA />;
}
