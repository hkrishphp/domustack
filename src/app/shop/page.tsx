import Navbar from "@/components/Navbar";
import Image from "next/image";

const categories = [
  {
    name: "Flooring",
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&q=80",
    count: 245,
  },
  {
    name: "Lighting",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80",
    count: 189,
  },
  {
    name: "Kitchen Fixtures",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    count: 312,
  },
  {
    name: "Bathroom",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
    count: 178,
  },
];

const products = [
  { name: "Premium Hardwood Flooring", price: "$8.99/sq ft", rating: 4.8, reviews: 156 },
  { name: "Modern Pendant Light Set", price: "$129.00", rating: 4.9, reviews: 89 },
  { name: "Brushed Nickel Faucet", price: "$249.00", rating: 4.7, reviews: 203 },
  { name: "Ceramic Subway Tiles (box)", price: "$45.00", rating: 4.8, reviews: 341 },
  { name: "Smart Thermostat", price: "$179.00", rating: 4.9, reviews: 512 },
  { name: "Frameless Shower Door", price: "$389.00", rating: 4.6, reviews: 94 },
  { name: "Quartz Countertop Sample", price: "$12.99", rating: 4.8, reviews: 267 },
  { name: "LED Recessed Light Kit", price: "$89.00", rating: 4.7, reviews: 178 },
];

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-card py-16">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <h1 className="text-[32px] md:text-[48px] font-medium leading-tight mb-4">
              Shop Materials & Fixtures
            </h1>
            <p className="text-muted-foreground text-lg max-w-[560px] mx-auto mb-8">
              Quality materials hand-picked by top contractors, delivered to your door.
            </p>
            <div className="max-w-[480px] mx-auto flex items-center gap-2 px-4 py-3 bg-background rounded-[var(--radius)] border border-border">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-sm bg-transparent placeholder:text-muted-foreground border-none outline-none"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="text-2xl font-medium mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="relative h-[180px] rounded-[var(--radius)] overflow-hidden cursor-pointer group"
                >
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                    <p className="text-sm text-white/80">{cat.count} products</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16 bg-card">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="text-2xl font-medium mb-6">Popular Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="bg-background rounded-[var(--radius)] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer"
                >
                  <div className="h-[140px] bg-secondary rounded-lg mb-4 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="1.5" opacity="0.5">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V4a4 4 0 0 0-8 0v3" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{product.name}</h3>
                  <p className="text-primary font-semibold text-[15px] mb-2">{product.price}</p>
                  <div className="flex items-center gap-1.5 text-[13px]">
                    <span className="text-rating font-semibold">&#9733; {product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
