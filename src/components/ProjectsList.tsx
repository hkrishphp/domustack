"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient, type Project } from "@/lib/supabase";
import { statusLabel, statusColor, formatDate } from "@/lib/utils";

export default function ProjectsList({
  initialProjects,
  userId,
}: {
  initialProjects: Project[];
  userId: string;
}) {
  const [projects, setProjects] = useState(initialProjects);

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

  return (
    <div className="flex flex-col gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-card rounded-[var(--radius)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer"
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
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">
                {project.budget}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {project.start_date ? formatDate(project.start_date) : "TBD"} —{" "}
                {project.end_date ? formatDate(project.end_date) : "TBD"}
              </p>
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
