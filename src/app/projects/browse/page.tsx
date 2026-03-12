import Navbar from "@/components/Navbar";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchKontraioServices, fetchKontraioCompanyByEmail, fetchKontraioServiceAreaZips } from "@/lib/kontraio";
import { getServiceIcon } from "@/lib/service-areas";

export const dynamic = "force-dynamic";
import ProjectsFeed from "@/components/ProjectsFeed";
import type { Project } from "@/lib/supabase";

type Props = {
  searchParams: Promise<{ service?: string }>;
};

export default async function BrowseProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const serviceFilter = params.service || "";

  const [supabase, services] = await Promise.all([
    createServerSupabaseClient(),
    fetchKontraioServices(),
  ]);

  // Check if logged-in user is a Kontraio contractor → filter by their service area
  const { data: { user } } = await supabase.auth.getUser();
  let serviceAreaZips: string[] | null = null;

  if (user?.email) {
    const companyId = await fetchKontraioCompanyByEmail(user.email);
    if (companyId) {
      const zips = await fetchKontraioServiceAreaZips(companyId);
      if (zips.length > 0) serviceAreaZips = zips;
    }
  }

  let query = supabase
    .from("projects")
    .select("*, users(full_name)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (serviceFilter) {
    query = query.contains("service_types", [serviceFilter]);
  }

  if (serviceAreaZips) {
    query = query.in("zip_code", serviceAreaZips);
  }

  const { data } = await query;
  const projects = (data as Project[] | null) ?? [];
  const isLocationFiltered = serviceAreaZips !== null;

  const serviceList = services.map((s) => ({
    slug: s.slug,
    name: s.name,
    icon_name: s.icon_name,
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-white border-b border-border py-10">
          <div className="mx-auto max-w-[1280px] px-6">
            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight mb-2">
              Available Projects
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse open projects and submit your bid to win new work.
            </p>
          </div>
        </section>

        {/* Service filter bar */}
        <section className="bg-white border-b border-border">
          <div className="mx-auto max-w-[1280px] px-6 py-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Link
                href="/projects/browse"
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                  !serviceFilter
                    ? "bg-accent text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </Link>
              {serviceList.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/projects/browse?service=${svc.slug}`}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                    serviceFilter === svc.slug
                      ? "bg-accent text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {getServiceIcon(svc.icon_name)} {svc.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Project count + grid */}
        <section className="py-8">
          <div className="mx-auto max-w-[1280px] px-6">
            <p className="text-sm text-muted-foreground mb-6">
              {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}{" "}
              {isLocationFiltered ? "in your service area" : "available"}
            </p>
            <ProjectsFeed
              initialProjects={projects}
              serviceFilter={serviceFilter}
              services={serviceList}
              allowedZips={serviceAreaZips ?? undefined}
              isLocationFiltered={isLocationFiltered}
            />
          </div>
        </section>
      </main>
    </>
  );
}
