"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Project } from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/utils";
import { getServiceLabel, getTimelineLabel, getBudgetLabel } from "@/lib/service-areas";

type ServiceItem = {
  slug: string;
  name: string;
  icon_name: string;
};

type Props = {
  initialProjects: Project[];
  serviceFilter: string;
  services?: ServiceItem[];
  allowedZips?: string[];
  isLocationFiltered?: boolean;
};

export default function ProjectsFeed({ initialProjects, serviceFilter, services, allowedZips, isLocationFiltered }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [newAlert, setNewAlert] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const channel = supabase
      .channel("browse-projects-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "projects" },
        async (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newProject = payload.new as any;
          if (newProject.status !== "open") return;

          // Check zip code filter (contractor service area)
          if (allowedZips && !allowedZips.includes(newProject.zip_code)) return;

          // Check service filter
          if (serviceFilter) {
            const svcTypes = newProject.service_types || [];
            if (!svcTypes.includes(serviceFilter)) return;
          }

          // Re-fetch to get joined data
          const { data } = await supabase
            .from("projects")
            .select("*, users(full_name)")
            .eq("id", newProject.id)
            .single();

          if (data) {
            setProjects((prev) => [data as Project, ...prev]);
            setNewAlert(true);
            setTimeout(() => setNewAlert(false), 5000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [serviceFilter, allowedZips]);

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <svg className="mx-auto mb-4 text-muted-foreground" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
          <path d="M3 9h6" />
        </svg>
        <h2 className="text-xl font-medium mb-2">
          {isLocationFiltered ? "No open projects in your service area" : "No open projects yet"}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {isLocationFiltered
            ? "Projects matching your service area will appear here when homeowners submit them."
            : "New projects will appear here when homeowners submit them. Check back soon!"}
        </p>
      </div>
    );
  }

  return (
    <>
      {newAlert && (
        <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-xl text-sm text-accent font-medium animate-pulse">
          New project just posted!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const svcSlugs = (project.service_types || []) as string[];
          return (
            <Link
              key={project.id}
              href={`/projects/browse/${project.id}`}
              className="group bg-white rounded-2xl border border-border p-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Service badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {svcSlugs.slice(0, 3).map((slug) => (
                  <span
                    key={slug}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent"
                  >
                    {getServiceLabel(slug, services)}
                  </span>
                ))}
                {svcSlugs.length > 3 && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                    +{svcSlugs.length - 3} more
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition">
                {project.name}
              </h3>

              {/* Key details */}
              <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                {project.budget_range && (
                  <div className="flex items-center gap-1.5">
                    <span>💰</span>
                    <span>{getBudgetLabel(project.budget_range)}</span>
                  </div>
                )}
                {project.timeline && (
                  <div className="flex items-center gap-1.5">
                    <span>⏱️</span>
                    <span>{getTimelineLabel(project.timeline)}</span>
                  </div>
                )}
                {project.city && (
                  <div className="flex items-center gap-1.5">
                    <span>📍</span>
                    <span>
                      {project.city}
                      {project.zip_code ? `, ${project.zip_code}` : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                <span>
                  {project.contact_first_name
                    ? `Posted by ${project.contact_first_name}`
                    : "Posted"}
                </span>
                <span>{formatRelativeTime(project.created_at)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
