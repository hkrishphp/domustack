import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domustack — Verified contractors. Free quotes in 24 hours.",
  description:
    "Compare licensed, insured, background-checked contractors for your renovation. Get free quotes from up to 4 vetted pros — no obligation.",
};

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return <div className="theme-craftsman min-h-screen">{children}</div>;
}
