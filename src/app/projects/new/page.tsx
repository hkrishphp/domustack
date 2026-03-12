import Navbar from "@/components/Navbar";
import { fetchKontraioServices } from "@/lib/kontraio";
import ProjectWizard from "@/components/ProjectWizard";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const services = await fetchKontraioServices();

  // Map to simple serializable format for client component
  const serviceList = services.map((s) => ({
    slug: s.slug,
    name: s.name,
    icon_name: s.icon_name,
  }));

  return (
    <>
      <Navbar />
      <ProjectWizard services={serviceList} />
    </>
  );
}
