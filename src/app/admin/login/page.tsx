import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin login — Domustack" };

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="theme-craftsman min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Domustack Admin</h1>
          <p className="text-muted-foreground text-sm">Sign in to view project inquiries.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
