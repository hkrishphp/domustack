"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const projects = [
  {
    title: "Kitchen Remodel",
    location: "Austin, TX",
    before: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    after: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Master Bathroom",
    location: "Seattle, WA",
    before: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80",
    after: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Living Room Refresh",
    location: "Charlotte, NC",
    before: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Home Exterior",
    location: "Portland, OR",
    before: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80",
    after: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
  },
];

function BeforeAfterSlider({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function setFromX(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl select-none cursor-ew-resize bg-secondary group"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        setFromX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromX(e.clientX);
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      }}
    >
      <Image
        src={after}
        alt={`${alt} — after`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div
        className="absolute inset-0"
        style={{ clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)` }}
      >
        <Image
          src={before}
          alt={`${alt} — before`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider">
        Before
      </span>
      <span className="absolute top-3 right-3 bg-[#6b8e6b] text-white px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider">
        After
      </span>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f2940" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function GalleryV1() {
  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-[680px] mx-auto text-center mb-14">
          <p className="text-accent font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
            Before &amp; After
          </p>
          <h2 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            See the transformation
          </h2>
          <p className="text-muted-foreground text-lg">
            Real Domustack renovations. Drag the slider to reveal the after.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((p) => (
            <div key={p.title}>
              <BeforeAfterSlider before={p.before} after={p.after} alt={p.title} />
              <div className="flex items-center justify-between mt-4 px-1">
                <h3 className="font-bold text-foreground text-[16px]">{p.title}</h3>
                <span className="text-muted-foreground text-[13px]">{p.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
