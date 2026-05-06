"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated, clearAdminSession } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";

const ALLOWED_STATUS = ["new", "contacted", "converted", "closed", "spam"] as const;
type Status = (typeof ALLOWED_STATUS)[number];

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateStatusAction(id: string, status: string) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }
  if (!ALLOWED_STATUS.includes(status as Status)) {
    return { error: "Invalid status" };
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("project_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteInquiryAction(id: string) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("project_inquiries")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}
