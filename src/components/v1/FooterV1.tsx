import Image from "next/image";
import Link from "next/link";

export default function FooterV1() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 pb-12 border-b border-white/10">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logos/variant-1/logo-white.png"
                alt="Domustack"
                width={2199}
                height={416}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-[420px]">
              The trusted marketplace for home renovation. Verified contractors,
              transparent pricing, real reviews — all in one place.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">For Homeowners</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#project-form" className="hover:text-white transition">Get free quotes</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How it works</a></li>
              <li><a href="#mission" className="hover:text-white transition">Our mission</a></li>
              <li><a href="#reviews" className="hover:text-white transition">Reviews</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[13px] text-white/60">
          <p>© {new Date().getFullYear()} Purple Heart Pros LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
