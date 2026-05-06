const services = [
  { name: "Kitchen Remodel", icon: "🍳" },
  { name: "Bathroom Remodel", icon: "🛁" },
  { name: "Whole Home Renovation", icon: "🏡" },
  { name: "Room Addition", icon: "➕" },
  { name: "Basement Finishing", icon: "🪜" },
  { name: "Attic Conversion", icon: "🏚️" },
  { name: "Garage Conversion", icon: "🚗" },
  { name: "ADU / In-Law Suite", icon: "🏘️" },
  { name: "Roofing", icon: "🏠" },
  { name: "Siding", icon: "🧱" },
  { name: "Windows & Doors", icon: "🪟" },
  { name: "Gutters", icon: "🌧️" },
  { name: "Decks & Patios", icon: "🪴" },
  { name: "Fencing", icon: "🚧" },
  { name: "Driveways & Walkways", icon: "🛣️" },
  { name: "Interior Painting", icon: "🎨" },
  { name: "Exterior Painting", icon: "🖌️" },
  { name: "Hardwood Flooring", icon: "🪵" },
  { name: "Tile & Stone", icon: "🪨" },
  { name: "Drywall & Trim", icon: "📐" },
  { name: "Cabinet Refacing", icon: "🗄️" },
  { name: "Custom Carpentry", icon: "🔨" },
  { name: "Electrical", icon: "⚡" },
  { name: "Plumbing", icon: "🚿" },
  { name: "HVAC", icon: "❄️" },
  { name: "Insulation", icon: "🧊" },
  { name: "Solar Installation", icon: "☀️" },
  { name: "Smart Home", icon: "📡" },
  { name: "Landscaping", icon: "🌿" },
  { name: "Outdoor Kitchen", icon: "🔥" },
  { name: "Pool Installation", icon: "🏊" },
  { name: "Pergolas & Gazebos", icon: "🏛️" },
];

export default function PricingStripV1() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-[680px] mx-auto text-center mb-14">
          <p className="text-accent font-semibold text-[13px] tracking-[0.15em] uppercase mb-3">
            Services We Cover
          </p>
          <h2 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            Every renovation. One platform.
          </h2>
          <p className="text-muted-foreground text-lg">
            From a single-room refresh to a whole-home remodel, our verified contractors handle every category — indoors, outdoors, and the systems behind your walls.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {services.map((s) => (
            <div
              key={s.name}
              className="group flex items-center gap-3 bg-white border border-border rounded-xl p-4 hover:border-accent/40 hover:shadow-[0_8px_24px_rgba(15,41,64,0.06)] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
                {s.icon}
              </div>
              <h3 className="font-semibold text-foreground text-[14px] leading-snug">{s.name}</h3>
            </div>
          ))}
        </div>

        <p className="text-center text-[13px] text-muted-foreground mt-10">
          Don&apos;t see your project?{" "}
          <a href="#project-form" className="text-accent font-semibold underline underline-offset-2 hover:brightness-90">
            Tell us anyway
          </a>{" "}
          — we likely have a pro for it.
        </p>
      </div>
    </section>
  );
}
