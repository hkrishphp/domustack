import LegalLayout from "@/components/v1/LegalLayout";

export const metadata = {
  title: "Terms of Service — Domustack",
  description: "The terms governing your use of Domustack, operated by Purple Heart Pros LLC.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="May 6, 2026">
      <Section heading="1. Acceptance of terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Domustack
          website, applications, and services (the &ldquo;Services&rdquo;), operated by{" "}
          <strong>Purple Heart Pros LLC</strong> (&ldquo;Domustack,&rdquo; &ldquo;we,&rdquo;
          &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By using the Services, you agree to these Terms.
          If you do not agree, do not use the Services.
        </p>
      </Section>

      <Section heading="2. What Domustack is">
        <p>
          Domustack is a marketplace that connects homeowners (&ldquo;Homeowners&rdquo;) with
          independent third-party renovation contractors (&ldquo;Contractors&rdquo;). We facilitate
          introductions, communication, and quote comparisons. We are <strong>not</strong> a party
          to any contract between Homeowners and Contractors and are <strong>not</strong>{" "}
          responsible for the work performed by Contractors.
        </p>
      </Section>

      <Section heading="3. Eligibility">
        <p>
          You must be at least 18 years old and able to form a binding contract under U.S. law to
          use the Services. By using Domustack, you represent and warrant that you meet these
          requirements.
        </p>
      </Section>

      <Section heading="4. No fees for homeowners">
        <p>
          Domustack is free for Homeowners. We do not charge per-lead fees to Contractors. We may
          offer optional premium tools to Contractors who want additional exposure; these
          subscriptions are billed directly to those Contractors and do not affect the quotes you
          receive.
        </p>
      </Section>

      <Section heading="5. Contractor verification">
        <p>
          We perform reasonable verification of Contractor licenses, insurance, and background
          checks before listing them on the platform. We rely on information provided by
          Contractors and third-party verification services and cannot guarantee that all
          information remains accurate at all times. <strong>Always confirm a Contractor&apos;s
          current credentials directly before signing a contract or releasing payment.</strong>
        </p>
      </Section>

      <Section heading="6. Your responsibilities">
        <ul>
          <li>Provide accurate, current, and complete project information.</li>
          <li>Communicate respectfully with Contractors and our staff.</li>
          <li>Do not misuse the Services (no scraping, automated access, fraud, or harassment).</li>
          <li>Do not upload content you do not have the right to share.</li>
        </ul>
      </Section>

      <Section heading="7. Disclaimers">
        <p>
          The Services are provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as
          available.&rdquo;</strong> To the maximum extent permitted by law, we disclaim all
          warranties, express or implied, including merchantability, fitness for a particular
          purpose, and non-infringement. We do not warrant that the Services will be
          uninterrupted, secure, or error-free, and we do not warrant the work, conduct, or
          credentials of any Contractor.
        </p>
      </Section>

      <Section heading="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Purple Heart Pros LLC and its directors,
          officers, employees, and agents shall not be liable for any indirect, incidental,
          consequential, special, or punitive damages, or for lost profits, lost data, or business
          interruption, arising out of or relating to your use of the Services. Our aggregate
          liability for any claim relating to the Services shall not exceed <strong>USD
          $100</strong>.
        </p>
      </Section>

      <Section heading="9. Indemnification">
        <p>
          You agree to indemnify and hold harmless Purple Heart Pros LLC from any claim, loss, or
          expense (including reasonable attorneys&apos; fees) arising from your use of the
          Services, your violation of these Terms, or your violation of any third-party rights.
        </p>
      </Section>

      <Section heading="10. Governing law and disputes">
        <p>
          These Terms are governed by the laws of the United States and the state in which Purple
          Heart Pros LLC is registered, without regard to conflict-of-law rules. Any dispute shall
          be resolved in the state and federal courts located in that state, and you consent to
          their personal jurisdiction.
        </p>
      </Section>

      <Section heading="11. Termination">
        <p>
          We may suspend or terminate your access to the Services at any time, with or without
          notice, for any reason, including violation of these Terms. You may stop using the
          Services at any time.
        </p>
      </Section>

      <Section heading="12. Changes">
        <p>
          We may modify these Terms from time to time. The &ldquo;Last updated&rdquo; date above
          will reflect the most recent change. Continued use of the Services after a change
          constitutes acceptance.
        </p>
      </Section>

      <Section heading="13. Contact us">
        <p>
          <strong>Purple Heart Pros LLC</strong><br />
          Email: <a href="mailto:mail@purpleheartpros.com">mail@purpleheartpros.com</a>
        </p>
      </Section>
    </LegalLayout>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{heading}</h2>
      <div className="text-foreground/85 leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-2 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}
