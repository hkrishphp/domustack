import Image from "next/image";

type Item = {
  src: string;
  title: string;
  category: string;
  notes: string;
};

const items: Item[] = [
  // ── Kitchens ──────────────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
    title: "Modern Two-Tone Kitchen",
    category: "Kitchen",
    notes: "Navy lowers · Quartz waterfall island · Brass hardware",
  },
  {
    src: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=900&q=80",
    title: "Open-Concept Cookspace",
    category: "Kitchen",
    notes: "Pendant lighting · Marble backsplash · Hidden appliance garage",
  },
  {
    src: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80",
    title: "Compact Galley Refresh",
    category: "Kitchen",
    notes: "Light wood cabinets · Under-cabinet LEDs · Quartz counters",
  },

  // ── Bathrooms ─────────────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80",
    title: "Spa-Style Bathroom",
    category: "Bathroom",
    notes: "Walk-in shower · Floating vanity · Heated tile floor",
  },
  {
    src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80",
    title: "Wet Room Wet Look",
    category: "Bathroom",
    notes: "Floor-to-ceiling tile · Frameless glass · Niche storage",
  },
  {
    src: "https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=900&q=80",
    title: "Soaking Tub Master Bath",
    category: "Bathroom",
    notes: "Freestanding tub · Marble surround · Warm sconces",
  },
  {
    src: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=900&q=80",
    title: "Powder Room Refresh",
    category: "Bathroom",
    notes: "Wallpaper accent · Vessel sink · Brass fixtures",
  },

  // ── Living & Family ───────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    title: "Bright Living Room",
    category: "Living",
    notes: "Linen sofa · Statement art wall · Engineered hardwood",
  },
  {
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
    title: "Custom Fireplace Wall",
    category: "Living",
    notes: "Stacked stone · Built-in TV niche · Hidden cable management",
  },
  {
    src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
    title: "Sunken Conversation Pit",
    category: "Living",
    notes: "Built-in seating · Curved walls · Ambient lighting",
  },

  // ── Bedrooms ──────────────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    title: "Calming Primary Bedroom",
    category: "Bedroom",
    notes: "Upholstered headboard · Soft sage palette · Sheer drapes",
  },
  {
    src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80",
    title: "Modern Guest Suite",
    category: "Bedroom",
    notes: "Minimal millwork · Brass sconces · Wide-plank flooring",
  },
  {
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    title: "Accent-Wall Bedroom",
    category: "Bedroom",
    notes: "Painted feature wall · Ceiling fan upgrade · Built-in nightstands",
  },

  // ── Dining ────────────────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?auto=format&fit=crop&w=900&q=80",
    title: "Banquette Breakfast Nook",
    category: "Dining",
    notes: "Built-in bench · Window walls · Hidden storage",
  },

  // ── Outdoor ──────────────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
    title: "Backyard Living Patio",
    category: "Outdoor",
    notes: "Composite decking · Pergola overhead · Outdoor kitchen run",
  },
  {
    src: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80",
    title: "Pool & Cabana",
    category: "Outdoor",
    notes: "Travertine deck · Cabana shade · LED pool lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=80",
    title: "Pergola & Outdoor Grill",
    category: "Outdoor",
    notes: "Cedar pergola · Built-in grill island · String lighting",
  },

  // ── Custom Builds & Millwork ──────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&w=900&q=80",
    title: "Walk-In Closet Build-Out",
    category: "Custom Build",
    notes: "Custom millwork · Soft-close drawers · LED rod lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80",
    title: "Custom Library Wall",
    category: "Custom Build",
    notes: "Floor-to-ceiling shelves · Rolling ladder · Hidden door",
  },
  {
    src: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=900&q=80",
    title: "Wine Cellar Build",
    category: "Custom Build",
    notes: "Climate control · Custom racking · Stone accent wall",
  },

  // ── Home Office ───────────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=900&q=80",
    title: "Built-In Home Office",
    category: "Home Office",
    notes: "Custom millwork · Cable management · Acoustic wall panels",
  },

  // ── Flooring ──────────────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=900&q=80",
    title: "Hardwood Floor Refinish",
    category: "Flooring",
    notes: "Sanded & restained on-site · Satin finish · Whole-home install",
  },

  // ── Staircase ─────────────────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?auto=format&fit=crop&w=900&q=80",
    title: "Open-Riser Staircase",
    category: "Staircase",
    notes: "Steel stringer · Oak treads · Glass railing",
  },

  // ── Mudroom / Pantry / Foyer ──────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1581622558661-d0e3b1c0c87e?auto=format&fit=crop&w=900&q=80",
    title: "Mudroom Conversion",
    category: "Mudroom",
    notes: "Custom cubbies · Slate floor · Coat hooks",
  },
  {
    src: "https://images.unsplash.com/photo-1600573472556-7a7b7e1a9eef?auto=format&fit=crop&w=900&q=80",
    title: "Walk-In Pantry Build",
    category: "Pantry",
    notes: "Floor-to-ceiling shelves · Pull-out drawers · Under-shelf LEDs",
  },
  {
    src: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=900&q=80",
    title: "Modern Foyer Refresh",
    category: "Entry",
    notes: "Statement light · Bench & hooks · Tile floor",
  },

  // ── Basement / Conversion ────────────────────────────────
  {
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    title: "Finished Basement",
    category: "Basement",
    notes: "Egress windows · Recessed lighting · Built-in entertainment",
  },
];

export default function GalleryV1() {
  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-[680px] mx-auto text-center mb-14">
          <p className="text-accent font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
            Inspiration
          </p>
          <h2 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            Renovations to inspire your project
          </h2>
          <p className="text-muted-foreground text-lg">
            A curated mix of kitchens, baths, additions, custom builds, and
            outdoor work — to spark ideas before you tell us what you&apos;re
            building.
          </p>
        </div>

        <ul className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>li]:mb-5 [&>li]:break-inside-avoid">
          {items.map((it) => (
            <li key={it.title}>
              <figure className="relative overflow-hidden rounded-2xl border border-border bg-secondary group">
                <div className="relative w-full">
                  <Image
                    src={it.src}
                    alt={it.title}
                    width={900}
                    height={1200}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <figcaption className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-[#0f2940]/85 via-[#0f2940]/40 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[11px] tracking-[0.15em] uppercase font-bold text-[#a8c0a4] mb-1">
                    {it.category}
                  </span>
                  <h3 className="text-lg font-bold leading-tight mb-1">{it.title}</h3>
                  <p className="text-[12.5px] text-white/80 leading-snug">{it.notes}</p>
                </figcaption>
                <span className="md:hidden absolute top-3 left-3 bg-black/70 backdrop-blur text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                  {it.category}
                </span>
              </figure>
              <div className="md:hidden mt-2 px-1">
                <h3 className="font-bold text-foreground text-[14px] leading-tight">{it.title}</h3>
                <p className="text-muted-foreground text-[12px]">{it.notes}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm mb-3">
            Found a look you love?
          </p>
          <a
            href="#project-form"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary !text-white rounded-xl text-[15px] font-semibold hover:bg-primary/90 transition shadow-[0_4px_14px_rgba(15,41,64,0.18)]"
          >
            Tell us what you&apos;re building
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
