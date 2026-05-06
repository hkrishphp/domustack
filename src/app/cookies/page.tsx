import LegalLayout from "@/components/v1/LegalLayout";

export const metadata = {
  title: "Cookie Policy — Domustack",
  description: "How Purple Heart Pros LLC (Domustack) uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="May 6, 2026">
      <Section heading="1. What are cookies?">
        <p>
          Cookies are small text files placed on your device by websites you visit. They are
          widely used to make websites work, remember your preferences, and provide analytics.
          Similar technologies include local storage, pixels, and SDKs.
        </p>
        <p>
          This Cookie Policy explains how <strong>Purple Heart Pros LLC</strong> (operator of
          Domustack) uses cookies and your choices.
        </p>
      </Section>

      <Section heading="2. Categories of cookies we use">
        <h3>Strictly necessary cookies</h3>
        <p>
          Required for the Services to function — for example, keeping you signed in, securing the
          form, and protecting against fraud. These cookies cannot be disabled.
        </p>

        <h3>Functional cookies</h3>
        <p>
          Remember your preferences, such as the city or service type you selected, so you
          don&apos;t have to re-enter them on your next visit.
        </p>

        <h3>Analytics cookies</h3>
        <p>
          Help us understand which pages homeowners visit, where they come from, and where they
          run into trouble — so we can improve the experience. We use privacy-respecting
          analytics; we do <strong>not</strong> share or sell this data to advertising networks.
        </p>

        <h3>Marketing cookies</h3>
        <p>
          We currently <strong>do not</strong> run third-party advertising or retargeting cookies.
          If this changes, we will update this policy and request consent where required.
        </p>
      </Section>

      <Section heading="3. Cookies we set">
        <ul>
          <li><code>sb-access-token</code>, <code>sb-refresh-token</code> — Supabase auth session (strictly necessary).</li>
          <li><code>domustack-prefs</code> — your saved location, service type, and budget filters (functional).</li>
          <li><code>_ds_anon_id</code> — anonymous analytics identifier (analytics).</li>
        </ul>
      </Section>

      <Section heading="4. Third-party cookies">
        <p>
          A small number of third-party services we use may set their own cookies, including:
        </p>
        <ul>
          <li><strong>Supabase</strong> — authentication and session management.</li>
          <li><strong>Vercel</strong> — site hosting and performance analytics.</li>
          <li><strong>Google Fonts</strong> — font delivery (no personalized cookies).</li>
        </ul>
      </Section>

      <Section heading="5. Your choices">
        <p>You can control cookies in several ways:</p>
        <ul>
          <li><strong>Browser settings:</strong> most browsers let you block or delete cookies. See your browser&apos;s help docs.</li>
          <li><strong>Do Not Track:</strong> we honor browser DNT signals where applicable.</li>
          <li><strong>Opt-out of analytics:</strong> email <a href="mailto:mail@purpleheartpros.com">mail@purpleheartpros.com</a> with the subject line &ldquo;Opt-out of analytics&rdquo;.</li>
        </ul>
        <p>
          Note: blocking strictly necessary cookies will break sign-in and the project form.
        </p>
      </Section>

      <Section heading="6. Changes">
        <p>
          We may update this Cookie Policy as our practices evolve. The &ldquo;Last updated&rdquo;
          date above will reflect the most recent change.
        </p>
      </Section>

      <Section heading="7. Contact us">
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
      <div className="text-foreground/85 leading-relaxed [&_p]:mb-4 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-2 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-secondary [&_code]:text-[13px]">
        {children}
      </div>
    </section>
  );
}
