import Navbar from "@/components/Navbar";

export default function InspirationsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-6 py-20">
        <h1 className="text-4xl font-medium mb-4">Inspirations</h1>
        <p className="text-muted-foreground text-lg">
          Browse renovation ideas and design inspiration for your next project.
        </p>
      </main>
    </>
  );
}
