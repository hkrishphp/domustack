import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domustack",
  description: "Connect with trusted general contractors across the US. Manage projects, payments, and communication all in one inspiring platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
