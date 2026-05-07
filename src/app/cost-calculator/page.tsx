import NavbarV1 from "@/components/v1/NavbarV1";
import FooterV1 from "@/components/v1/FooterV1";
import CostCalculatorV1 from "@/components/v1/CostCalculatorV1";

export const metadata = {
  title: "Renovation Cost Calculator — Bathroom & Kitchen Estimates",
  description:
    "Get a fast, regional cost estimate for your bathroom or kitchen renovation. Pick a quality tier, enter your ZIP, see expected price range and the permits you'll likely need.",
  alternates: { canonical: "/cost-calculator" },
};

export default function CostCalculatorPage() {
  return (
    <div className="theme-craftsman min-h-screen bg-background">
      <NavbarV1 />

      <main>
        <section className="bg-white border-b border-border py-16 md:py-20">
          <div className="mx-auto max-w-[820px] px-6 text-center">
            <p className="text-accent font-semibold text-[12px] tracking-[0.2em] uppercase mb-3">
              Cost Calculator
            </p>
            <h1 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
              Estimate your renovation in 60 seconds
            </h1>
            <p className="text-muted-foreground text-lg max-w-[640px] mx-auto">
              Pick the project type, your ZIP, and the quality tier you have in
              mind. We&apos;ll show a regional cost range and the permits typically
              required.
            </p>
          </div>
        </section>

        <CostCalculatorV1 />
      </main>

      <FooterV1 />
    </div>
  );
}
