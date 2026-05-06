import Image from "next/image";
import Link from "next/link";

export default function FooterV1() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-[480px] mb-12 pb-12 border-b border-white/10">
          <Link href="/" className="inline-block mb-5">
            <Image
              src="/logos/variant-1/logo-white.png"
              alt="Domustack"
              width={2199}
              height={416}
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-white/70 text-sm leading-relaxed">
            The trusted marketplace for home renovation. Verified contractors,
            transparent pricing, real reviews — all in one place.
          </p>
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
