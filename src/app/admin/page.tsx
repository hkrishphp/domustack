import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import InquiriesTable, { type Inquiry } from "./InquiriesTable";
import { logoutAction } from "./actions";

export const metadata = { title: "Admin — Project Inquiries" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("project_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const inquiries: Inquiry[] = data ?? [];

  const counts = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    converted: inquiries.filter((i) => i.status === "converted").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
    spam: inquiries.filter((i) => i.status === "spam").length,
  };

  return (
    <div className="theme-craftsman min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Domustack Admin</h1>
            <p className="text-xs text-muted-foreground">Project inquiries</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
            Failed to load inquiries: {error.message}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          <Stat label="Total" value={counts.total} />
          <Stat label="New" value={counts.new} highlight />
          <Stat label="Contacted" value={counts.contacted} />
          <Stat label="Converted" value={counts.converted} />
          <Stat label="Closed" value={counts.closed} />
          <Stat label="Spam" value={counts.spam} />
        </div>

        <InquiriesTable inquiries={inquiries} />
      </main>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight && value > 0
          ? "border-accent/40 bg-accent/5"
          : "border-border bg-white"
      }`}
    >
      <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-bold text-foreground mt-1">{value}</div>
    </div>
  );
}
