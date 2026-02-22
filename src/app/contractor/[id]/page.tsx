import Navbar from "@/components/Navbar";
import Image from "next/image";

const contractorsData: Record<string, {
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  projects: number;
  description: string;
  services: string[];
}> = {
  "1": {
    name: "BuildRight Construction",
    specialty: "Kitchen & Bathroom Remodeling",
    rating: 4.9,
    reviews: 127,
    location: "Los Angeles, CA",
    price: "$$$",
    projects: 230,
    description: "With over 15 years of experience, BuildRight Construction specializes in transforming kitchens and bathrooms into stunning, functional spaces. Our team of skilled professionals is dedicated to delivering quality craftsmanship on every project.",
    services: ["Kitchen Remodeling", "Bathroom Renovation", "Cabinet Installation", "Countertop Replacement", "Tile Work", "Plumbing Upgrades"],
  },
  "2": {
    name: "Modern Home Solutions",
    specialty: "Full Home Renovations",
    rating: 4.8,
    reviews: 89,
    location: "New York, NY",
    price: "$$$$",
    projects: 156,
    description: "Modern Home Solutions brings contemporary design and expert craftsmanship to complete home transformations. From concept to completion, we handle every detail of your renovation with precision and care.",
    services: ["Full Home Renovation", "Open Floor Plan Conversion", "Structural Modifications", "Interior Design", "Smart Home Integration", "Energy Efficiency Upgrades"],
  },
  "3": {
    name: "Artisan Renovators",
    specialty: "Custom Carpentry & Flooring",
    rating: 4.9,
    reviews: 203,
    location: "Chicago, IL",
    price: "$$$",
    projects: 189,
    description: "Artisan Renovators is a team of master craftsmen passionate about woodworking and flooring. We create custom built-ins, stunning hardwood floors, and bespoke carpentry that adds character and value to your home.",
    services: ["Hardwood Flooring", "Custom Cabinetry", "Built-in Shelving", "Trim & Molding", "Deck Building", "Furniture Restoration"],
  },
  "4": {
    name: "Precision Builders Co.",
    specialty: "Exterior & Roofing",
    rating: 4.7,
    reviews: 94,
    location: "Austin, TX",
    price: "$$",
    projects: 145,
    description: "Precision Builders Co. protects and beautifies your home from the outside in. Specializing in roofing, siding, and exterior renovations, we use premium materials to ensure lasting durability and curb appeal.",
    services: ["Roof Replacement", "Siding Installation", "Gutter Systems", "Exterior Painting", "Window Installation", "Porch & Deck Construction"],
  },
};

const contractorImage = "https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc3MDg3MDc3OXww&ixlib=rb-4.1.0&q=80&w=1080";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContractorPage({ params }: Props) {
  const { id } = await params;
  const contractor = contractorsData[id];

  if (!contractor) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
          <h1 className="text-4xl font-medium mb-4">Contractor Not Found</h1>
          <p className="text-muted-foreground text-lg">The contractor you&apos;re looking for doesn&apos;t exist.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[300px] overflow-hidden">
          <Image
            src={contractorImage}
            alt={contractor.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-medium text-white">{contractor.name}</h1>
                <span className="bg-verified text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified
                </span>
              </div>
              <p className="text-white/80">{contractor.specialty}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-medium mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{contractor.description}</p>

              <h2 className="text-2xl font-medium mb-4">Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {contractor.services.map((service) => (
                  <div key={service} className="flex items-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {service}
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-medium mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {[
                  { author: "Jennifer M.", text: "Absolutely fantastic work! They transformed our kitchen beyond what we imagined.", rating: 5 },
                  { author: "Robert S.", text: "Professional, punctual, and great attention to detail. Highly recommend.", rating: 5 },
                  { author: "Lisa T.", text: "Great communication throughout the project. Very happy with the results.", rating: 4 },
                ].map((review) => (
                  <div key={review.author} className="bg-card rounded-[var(--radius)] p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-rating font-semibold text-sm">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="text-sm font-medium">{review.author}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div>
              <div className="bg-card rounded-[var(--radius)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-rating font-semibold text-lg">&#9733; {contractor.rating}</span>
                  <span className="text-muted-foreground text-sm">({contractor.reviews} reviews)</span>
                </div>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {contractor.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 3v18" />
                      <path d="M3 9h6" />
                    </svg>
                    {contractor.projects} completed projects
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Price range: {contractor.price}
                  </div>
                </div>
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition mb-3">
                  Request a Quote
                </button>
                <button className="w-full py-3 bg-secondary text-foreground rounded-[var(--radius)] text-[15px] font-medium hover:bg-secondary/80 transition">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
