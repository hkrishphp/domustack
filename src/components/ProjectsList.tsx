"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient, type Project } from "@/lib/supabase";
import { statusLabel, statusColor, formatDate } from "@/lib/utils";

export default function ProjectsList({
  initialProjects,
  userId,
}: {
  initialProjects: Project[];
  userId: string;
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const channel = supabase
      .channel("projects-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        async () => {
          // Re-fetch only this user's projects on any change
          const { data } = await supabase
            .from("projects")
            .select("*, contractors(name)")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
          if (data) setProjects(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function handleDelete(projectId: string, projectName: string) {
    if (!confirm(`Delete "${projectName}"? This cannot be undone.`)) return;
    setDeletingId(projectId);

    const supabase = createBrowserSupabaseClient();
    await supabase.from("projects").delete().eq("id", projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {projects.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No projects yet. Create your first project to get started!
        </p>
      )}
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-card rounded-[var(--radius)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(project.status)}`}
                >
                  {statusLabel(project.status)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Contractor: {project.contractors?.name ?? "Unassigned"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">
                  {project.budget}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {project.start_date ? formatDate(project.start_date) : "TBD"} —{" "}
                  {project.end_date ? formatDate(project.end_date) : "TBD"}
                </p>
              </div>
              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => router.push(`/projects/${project.id}/edit`)}
                  title="Edit project"
                  className="p-2 rounded-[var(--radius)] text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.name)}
                  disabled={deletingId === project.id}
                  title="Delete project"
                  className="p-2 rounded-[var(--radius)] text-muted-foreground hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-[13px] text-muted-foreground mt-2">
            {project.progress}% complete
          </p>
        </div>
      ))}
    </div>
  );
}
