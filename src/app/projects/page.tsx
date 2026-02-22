import Navbar from "@/components/Navbar";

const projects = [
  {
    name: "Kitchen Remodel",
    contractor: "BuildRight Construction",
    status: "In Progress",
    progress: 65,
    budget: "$45,000",
    startDate: "Jan 15, 2026",
    endDate: "Mar 30, 2026",
  },
  {
    name: "Master Bathroom Renovation",
    contractor: "Modern Home Solutions",
    status: "Planning",
    progress: 15,
    budget: "$22,000",
    startDate: "Mar 1, 2026",
    endDate: "Apr 15, 2026",
  },
  {
    name: "Deck & Patio Build",
    contractor: "Precision Builders Co.",
    status: "Completed",
    progress: 100,
    budget: "$18,500",
    startDate: "Oct 1, 2025",
    endDate: "Nov 20, 2025",
  },
];

function statusColor(status: string) {
  if (status === "Completed") return "bg-verified/20 text-green-700";
  if (status === "In Progress") return "bg-primary/10 text-primary";
  return "bg-secondary text-muted-foreground";
}

export default function ProjectsPage() {
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
            <div className="flex flex-col gap-6">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="bg-card rounded-[var(--radius)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Contractor: {project.contractor}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{project.budget}</p>
                      <p className="text-[13px] text-muted-foreground">
                        {project.startDate} — {project.endDate}
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
                  <p className="text-[13px] text-muted-foreground mt-2">{project.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
