import Navbar from "@/components/Navbar";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContractorPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-6 py-20">
        <h1 className="text-4xl font-medium mb-4">Contractor #{id}</h1>
        <p className="text-muted-foreground text-lg">
          Detailed contractor profile, reviews, and portfolio coming soon.
        </p>
      </main>
    </>
  );
}
