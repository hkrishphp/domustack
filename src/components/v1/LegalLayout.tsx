import NavbarV1 from "@/components/v1/NavbarV1";
import FooterV1 from "@/components/v1/FooterV1";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="theme-craftsman min-h-screen">
      <NavbarV1 />
      <main className="bg-background">
        <div className="mx-auto max-w-[820px] px-6 py-20">
          <div className="mb-12 pb-10 border-b border-border">
            <p className="text-accent font-semibold text-[12px] tracking-[0.2em] uppercase mb-3">
              Legal
            </p>
            <h1 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-3">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">Last updated: {updated}</p>
          </div>

          <article className="prose-domustack">{children}</article>
        </div>
      </main>
      <FooterV1 />
    </div>
  );
}
