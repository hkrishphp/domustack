import Navbar from "@/components/Navbar";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-6 py-20">
        <h1 className="text-4xl font-medium mb-4">My Projects</h1>
        <p className="text-muted-foreground text-lg">
          Manage and track all your renovation projects in one place.
        </p>
      </main>
    </>
  );
}
