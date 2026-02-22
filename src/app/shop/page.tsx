import Navbar from "@/components/Navbar";

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-6 py-20">
        <h1 className="text-4xl font-medium mb-4">Shop</h1>
        <p className="text-muted-foreground text-lg">
          Discover materials, tools, and home improvement products.
        </p>
      </main>
    </>
  );
}
