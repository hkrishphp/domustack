"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#mission", label: "Mission" },
  { href: "#reviews", label: "Reviews" },
];

export default function NavbarV1() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-[0_2px_20px_rgba(15,41,64,0.06)]"
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-6 h-[76px] flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Domustack home">
          <Image
            src="/logos/variant-1/logo-transparent.png"
            alt="Domustack"
            width={2199}
            height={416}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-lg text-[14px] font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#project-form"
          className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#c87545] rounded-lg hover:brightness-110 active:scale-[0.98] transition shadow-[0_4px_14px_rgba(200,117,69,0.4)]"
        >
          Get Free Quote
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        <button
          className="lg:hidden text-foreground p-2"
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-6 pb-5">
          <nav className="flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-lg text-[15px] font-medium text-foreground hover:bg-primary/5 transition"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#project-form"
            onClick={() => setMobileOpen(false)}
            className="block text-center mt-2 py-3 text-[15px] font-semibold text-white bg-[#c87545] rounded-lg shadow-[0_4px_14px_rgba(200,117,69,0.4)]"
          >
            Get Free Quote
          </a>
        </div>
      )}
    </header>
  );
}
