import Navbar from "@/components/Navbar";
import ProjectsList from "@/components/ProjectsList";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Project } from "@/lib/supabase";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("projects")
    .select("*, contractors(name)")
    .eq("user_id", DEMO_USER_ID)
    .order("created_at", { ascending: false });

  const projects = (data as Project[] | null) ?? [];

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-card py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-[32px] md:text-[48px] font-medium leading-tight mb-2">
                  My Projects
                </h1>
                <p className="text-muted-foreground text-lg">
                  Track and manage all your renovation projects.
                </p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition w-fit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Project
              </button>
            </div>
          </div>
        </section>

        {/* Projects List */}
        <section className="py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <ProjectsList initialProjects={projects} />
          </div>
        </section>
      </main>
    </>
  );
}
