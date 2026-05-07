import LegalLayout from "@/components/v1/LegalLayout";

export const metadata = {
  title: "Privacy Policy — Domustack",
  description: "How Purple Heart Pros LLC (Domustack) collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="May 6, 2026">
      <Section heading="1. Who we are">
        <p>
          Domustack is operated by <strong>Purple Heart Pros LLC</strong> (&ldquo;Domustack,&rdquo;
          &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), a U.S. limited liability
          company. This Privacy Policy describes how we collect, use, disclose, and protect personal
          information when you use the Domustack website, services, and applications (collectively,
          the &ldquo;Services&rdquo;).
        </p>
      </Section>

      <Section heading="2. Information we collect">
        <p>We collect information you provide directly to us, including:</p>
        <ul>
          <li><strong>Project information:</strong> name, phone number, email, project type, project description, inspiration images, and budget range you submit through our project form.</li>
          <li><strong>Account information</strong> if you create an account: email, password, profile photo, and contact preferences.</li>
          <li><strong>Communication content:</strong> messages you exchange with contractors through the platform.</li>
          <li><strong>Automatically collected:</strong> IP address, device and browser type, pages viewed, referring URLs, and approximate location (from your IP).</li>
        </ul>
      </Section>

      <Section heading="3. How we use your information">
        <p>We use your information to:</p>
        <ul>
          <li>Match your project with up to four verified, licensed, and insured contractors.</li>
          <li>Send quotes, messages, and project updates between you and the contractors you connect with.</li>
          <li>Verify contractor credentials (license, insurance).</li>
          <li>Improve and secure our Services, prevent fraud, and comply with legal obligations.</li>
          <li>Send service emails and, if you opt in, occasional product updates. You can unsubscribe at any time.</li>
        </ul>
      </Section>

      <Section heading="4. How we share your information">
        <p>
          We share the project details you submit only with the verified contractors we match you
          with. We do <strong>not</strong> sell your personal information. We do <strong>not</strong>{" "}
          charge contractors per lead, so your information is never sold or auctioned to
          lead-generation networks. We may share information with:
        </p>
        <ul>
          <li>Service providers who help us operate the platform (hosting, email delivery, analytics) under confidentiality obligations.</li>
          <li>Government authorities when required by law, subpoena, or to protect rights and safety.</li>
          <li>An acquirer in the event of a merger, acquisition, or sale of substantially all assets.</li>
        </ul>
      </Section>

      <Section heading="5. Your choices and rights">
        <p>Depending on your jurisdiction (including California, Virginia, Colorado, Connecticut, and Utah), you may have rights to:</p>
        <ul>
          <li>Access and receive a copy of your personal information.</li>
          <li>Correct inaccurate information.</li>
          <li>Delete personal information, subject to legal retention requirements.</li>
          <li>Opt out of certain marketing communications.</li>
          <li>Opt out of &ldquo;sales&rdquo; or &ldquo;sharing&rdquo; of personal information (we do not sell).</li>
        </ul>
        <p>To exercise any of these rights, email us at <a href="mailto:mail@purpleheartpros.com">mail@purpleheartpros.com</a>.</p>
      </Section>

      <Section heading="6. Cookies">
        <p>
          We use cookies and similar technologies as described in our{" "}
          <a href="/cookies">Cookie Policy</a>.
        </p>
      </Section>

      <Section heading="7. Security">
        <p>
          We use industry-standard administrative, technical, and physical safeguards to protect
          your information, including encrypted connections (HTTPS), encrypted databases at rest,
          and access controls. No system is 100% secure, and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section heading="8. Children">
        <p>
          Domustack is not directed to children under 18, and we do not knowingly collect personal
          information from children. If you believe we have collected information from a child,
          contact us and we will delete it.
        </p>
      </Section>

      <Section heading="9. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be communicated
          by email or by a prominent notice on the Services before the change takes effect.
        </p>
      </Section>

      <Section heading="10. Contact us">
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
