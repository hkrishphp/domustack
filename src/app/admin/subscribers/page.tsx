import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import SubscribersTable, { type Subscriber } from "./SubscribersTable";
import { logoutAction } from "../actions";

export const metadata = { title: "Admin — Email Subscribers" };
export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("email_subscribers")
    .select("id, email, source, variant, city, zip_code, status, drip_step, created_at")
    .order("created_at", { ascending: false });

  const subscribers: Subscriber[] = data ?? [];
  const counts = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === "active").length,
    unsubscribed: subscribers.filter((s) => s.status === "unsubscribed").length,
    bounced: subscribers.filter((s) => s.status === "bounced").length,
  };

  return (
    <div className="theme-craftsman min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-lg font-bold text-foreground">Domustack Admin</h1>
              <p className="text-xs text-muted-foreground">Cheatsheet subscribers</p>
            </div>
            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className="px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition"
              >
                Project inquiries
              </Link>
              <Link
                href="/admin/subscribers"
                className="px-3 py-1.5 text-[13px] font-semibold text-primary bg-primary/5 rounded-lg"
              >
                Cheatsheet subscribers
              </Link>
            </nav>
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
            Failed to load subscribers: {error.message}
            {error.message.includes("does not exist") && (
              <div className="mt-2 text-[12.5px]">
                Run migration <code className="bg-white/60 px-1 py-0.5 rounded">012_email_subscribers.sql</code> to create the table.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Stat label="Total" value={counts.total} />
          <Stat label="Active" value={counts.active} highlight />
          <Stat label="Unsubscribed" value={counts.unsubscribed} />
          <Stat label="Bounced" value={counts.bounced} />
        </div>

        <SubscribersTable subscribers={subscribers} />
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
