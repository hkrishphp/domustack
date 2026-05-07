import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const GA_MEASUREMENT_ID = "G-89NT2NWS04";
const GADS_CONVERSION_ID = "AW-17601417211";
const SITE_URL = "https://domustack.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Domustack — Verified Renovation Contractors. Free Quotes in 24 Hours.",
    template: "%s | Domustack",
  },
  description:
    "Domustack is a free home-renovation marketplace. Tell us about your project and we'll match you with up to 4 licensed and insured contractors near you. Free quotes in 24 hours. No fees, no obligation.",
  keywords: [
    "home renovation contractors",
    "verified contractors near me",
    "free contractor quotes",
    "licensed home contractors",
    "kitchen remodel contractors",
    "bathroom remodel contractors",
    "general contractors",
    "home remodeling marketplace",
    "renovation quotes",
    "compare contractor bids",
    "insured home contractors",
    "Domustack",
    "Purple Heart Pros",
  ],
  authors: [{ name: "Purple Heart Pros LLC" }],
  creator: "Purple Heart Pros LLC",
  publisher: "Purple Heart Pros LLC",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Domustack",
    title: "Domustack — Verified Renovation Contractors. Free Quotes in 24 Hours.",
    description:
      "Match with up to 4 licensed and insured contractors near you. Free quotes in 24 hours. No fees, no per-lead surcharge — quotes reflect the work, not the platform tax.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Domustack — Verified Renovation Contractors",
    description:
      "Free quotes in 24 hours from up to 4 verified contractors. No fees. No spam calls.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Domustack",
  legalName: "Purple Heart Pros LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/variant-1/logo-transparent.png`,
  email: "mail@purpleheartpros.com",
  description:
    "Home-renovation marketplace connecting U.S. homeowners with verified, licensed, insured contractors. Free quotes in 24 hours.",
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Domustack",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
            gtag('config', '${GADS_CONVERSION_ID}');
          `}
        </Script>
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
