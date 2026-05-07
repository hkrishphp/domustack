import Script from "next/script";
import NavbarV1 from "@/components/v1/NavbarV1";
import FooterV1 from "@/components/v1/FooterV1";

export const metadata = {
  title: "FAQ — How Domustack Works, Fees, Verification & Privacy",
  description:
    "Common homeowner questions about Domustack — how we match you with verified renovation contractors, why quotes are free, how we verify licenses & insurance, and how we protect your data.",
  alternates: { canonical: "/faq" },
  keywords: [
    "domustack faq",
    "how to find verified contractors",
    "free renovation quotes",
    "contractor license verification",
    "renovation marketplace pricing",
  ],
};

const groups = [
  {
    title: "Pricing & fees",
    items: [
      {
        q: "Is Domustack really free for homeowners?",
        a: "Yes — 100%. We never charge homeowners a fee, a deposit, a subscription, or a commission on the work you have done. You can submit a project, receive quotes, and message contractors without paying anything.",
      },
      {
        q: "How does Domustack make money then?",
        a: "Optional premium tools for contractors who want extra exposure on the platform. Those subscriptions are billed directly to those contractors and do not affect the quotes you receive.",
      },
      {
        q: "Why are quotes through Domustack often lower than Angi or Thumbtack?",
        a: "Lead-gen sites typically charge contractors $50–$200 every time they read a homeowner's project. That cost gets quietly added to your quote. We charge $0 per lead — so contractors quote the actual work, not the platform tax.",
      },
    ],
  },
  {
    title: "How it works",
    items: [
      {
        q: "How fast will I hear back?",
        a: "Most homeowners get their first contractor response within a few hours, and a full set of quotes within 24 hours. Complex jobs (whole-home renovations, ADUs) can take 2–3 days as contractors visit the property.",
      },
      {
        q: "How many contractors will contact me?",
        a: "We hand-pick up to 4 verified contractors near you. We never broadcast your project to dozens of pros — that's how spam-call experiences happen on other platforms.",
      },
      {
        q: "Do I have to take any of the quotes?",
        a: "No. There is zero obligation. Compare quotes side-by-side, message contractors with questions, and walk away if none feel right. We will never pressure you to accept a bid.",
      },
      {
        q: "What if my project changes after I submit the form?",
        a: "Just message any of the matched contractors with the updates, or submit a fresh project with the new scope. Quotes will be regenerated based on the new details.",
      },
    ],
  },
  {
    title: "Contractors & verification",
    items: [
      {
        q: "How do you verify contractors?",
        a: "Every contractor on Domustack passes a 2-step check before we list them: (1) state contractor license verified directly with the issuing authority, and (2) general liability and workers' comp insurance certificates on file with current effective dates. We re-run both checks annually.",
      },
      {
        q: "What if a contractor's license expires or they lose insurance mid-project?",
        a: "We monitor renewal dates and automatically pause any contractor whose license or insurance lapses. If a project is in progress, we notify both parties immediately so you can decide how to proceed.",
      },
      {
        q: "Can I see a contractor's reviews before I pick?",
        a: "Yes — every contractor profile shows verified reviews from past Domustack homeowners. We do not allow contractors to remove negative reviews, and we mark reviews as verified only when we can confirm the project actually happened on the platform.",
      },
    ],
  },
  {
    title: "Quotes & projects",
    items: [
      {
        q: "What service types do you cover?",
        a: "Kitchens, bathrooms, whole-home remodels, room additions, ADUs, basement / attic / garage conversions, roofing, siding, windows & doors, fencing, decks & patios, painting, flooring, drywall, electrical, plumbing, HVAC, insulation, solar, smart home, landscaping, outdoor kitchens, pools, and more — see the Services section on the homepage for the full list.",
      },
      {
        q: "Do quotes include materials and labor?",
        a: "Yes — every quote on Domustack must break down materials, labor, timeline, and any allowances (e.g., tile budget) so you can compare apples-to-apples. If a quote is missing a section, message the contractor and they'll send a revised version.",
      },
      {
        q: "What if there's a dispute with a contractor?",
        a: "Reach out to mail@purpleheartpros.com. We mediate communication, document the issue, and (if warranted) suspend the contractor pending review. Domustack is not a party to your contract with the contractor, so legal recourse stays between you and them — but we provide records of all in-platform communication for your case.",
      },
    ],
  },
  {
    title: "Privacy & your data",
    items: [
      {
        q: "Who sees my project information?",
        a: "Only the up-to-4 verified contractors we match you with. We do not sell your information, we do not share it with lead-generation networks, and we do not run third-party ad cookies. Read more in our Privacy Policy.",
      },
      {
        q: "What happens to the inspiration photos I upload?",
        a: "They are stored securely in our private storage bucket and shared only with the matched contractors so they can quote accurately. You can request deletion of your photos and project at any time by emailing mail@purpleheartpros.com.",
      },
      {
        q: "Can I delete my account and data later?",
        a: "Yes. Email mail@purpleheartpros.com from the address you used to submit the project, and we'll delete your inquiry, photos, and any associated messages within 30 days. Some records may be retained where legally required (e.g., tax records).",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((g) =>
    g.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FAQPage() {
  return (
    <div className="theme-craftsman min-h-screen bg-background">
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <NavbarV1 />

      <main>
        <section className="bg-white border-b border-border py-16 md:py-20">
          <div className="mx-auto max-w-[820px] px-6 text-center">
            <p className="text-accent font-semibold text-[12px] tracking-[0.2em] uppercase mb-3">
              Help Center
            </p>
            <h1 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
              Frequently asked questions
            </h1>
            <p className="text-muted-foreground text-lg max-w-[620px] mx-auto">
              Everything homeowners ask before sending us a project. Don&apos;t see your question?{" "}
              <a href="mailto:mail@purpleheartpros.com" className="text-accent font-semibold underline underline-offset-2 hover:brightness-90">
                Email us
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[820px] px-6 py-16">
          {groups.map((group) => (
            <div key={group.title} className="mb-12 last:mb-0">
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                {group.title}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.q}
                    className="group bg-white border border-border rounded-xl overflow-hidden hover:border-accent/40 transition"
                  >
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <span className="font-semibold text-foreground text-[15px]">{item.q}</span>
                      <span className="shrink-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-foreground/60 group-open:rotate-45 transition-transform">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 -mt-1 text-foreground/80 text-[14.5px] leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-16 pt-10 border-t border-border text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Still have a question?</h3>
            <p className="text-muted-foreground mb-5">We usually reply within one business day.</p>
            <a
              href="mailto:mail@purpleheartpros.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary !text-white rounded-xl text-[15px] font-semibold hover:bg-primary/90 transition"
            >
              Email mail@purpleheartpros.com
            </a>
          </div>
        </div>
      </main>

      <FooterV1 />
    </div>
  );
}
