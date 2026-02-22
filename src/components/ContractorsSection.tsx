import Image from "next/image";
import Link from "next/link";

const contractors = [
  {
    id: 1,
    name: "BuildRight Construction",
    specialty: "Kitchen & Bathroom Remodeling",
    rating: 4.9,
    reviews: 127,
    location: "Los Angeles, CA",
    price: "$$$",
    projects: 230,
  },
  {
    id: 2,
    name: "Modern Home Solutions",
    specialty: "Full Home Renovations",
    rating: 4.8,
    reviews: 89,
    location: "New York, NY",
    price: "$$$$",
    projects: 156,
  },
  {
    id: 3,
    name: "Artisan Renovators",
    specialty: "Custom Carpentry & Flooring",
    rating: 4.9,
    reviews: 203,
    location: "Chicago, IL",
    price: "$$$",
    projects: 189,
  },
  {
    id: 4,
    name: "Precision Builders Co.",
    specialty: "Exterior & Roofing",
    rating: 4.7,
    reviews: 94,
    location: "Austin, TX",
    price: "$$",
    projects: 145,
  },
];

const contractorImage =
  "https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc3MDg3MDc3OXww&ixlib=rb-4.1.0&q=80&w=1080";

export default function ContractorsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-3">
          <div>
            <h2 className="text-[28px] md:text-4xl font-medium mb-2">Top-Rated Contractors</h2>
            <p className="text-base text-muted-foreground">
              Trusted professionals ready to bring your vision to life
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 text-primary font-medium text-[15px] mt-2 hover:opacity-80"
          >
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contractors.map((contractor) => (
            <Link
              key={contractor.id}
              href={`/contractor/${contractor.id}`}
              className="bg-card rounded-[var(--radius)] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all"
            >
              {/* Image */}
              <div className="relative h-[200px] overflow-hidden">
                <Image
                  src={contractorImage}
                  alt={contractor.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 right-3 bg-verified text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-base font-semibold mb-1">{contractor.name}</h3>
                <p className="text-[13px] text-muted-foreground mb-2.5">{contractor.specialty}</p>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-rating font-semibold text-sm">&#9733; {contractor.rating}</span>
                  <span className="text-muted-foreground text-[13px]">({contractor.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-2.5 text-[13px]">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {contractor.location}
                  </div>
                  <span className="text-muted-foreground font-medium">{contractor.price}</span>
                </div>
                <div className="text-[13px] text-muted-foreground pt-2.5 border-t border-border">
                  {contractor.projects} completed projects
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
