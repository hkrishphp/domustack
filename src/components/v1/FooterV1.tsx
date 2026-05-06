import Image from "next/image";
import Link from "next/link";

export default function FooterV1() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12 pb-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-2">
            <Link href="/v1" className="inline-block mb-5 bg-white rounded-lg p-3">
              <Image
                src="/logos/variant-1/logo-transparent.png"
                alt="Domustack"
                width={2199}
                height={416}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-[360px]">
              The trusted marketplace for home renovation. Verified contractors,
              transparent pricing, real reviews — all in one place.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">For Homeowners</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#quote" className="hover:text-white transition">Get free quotes</a></li>
              <li><Link href="/search" className="hover:text-white transition">Find contractors</Link></li>
              <li><Link href="/inspirations" className="hover:text-white transition">Inspiration</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How it works</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">For Pros</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition">Join Domustack</a></li>
              <li><a href="#" className="hover:text-white transition">Pro resources</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Sign in</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Press</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[13px] text-white/60">
          <p>© {new Date().getFullYear()} Domustack. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
