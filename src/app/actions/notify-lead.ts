"use server";

import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { sendLeadNotificationEmail, type LeadNotification } from "@/lib/email";

/**
 * Re-reads the inquiry by id (so the client can't fabricate the payload),
 * then emails it to the admin inbox. Designed to be fire-and-forget from the
 * client — failures are logged but never block the homeowner's success state.
 */
export async function notifyLeadAction(inquiryId: string): Promise<{ ok?: true; error?: string }> {
  if (!inquiryId) return { error: "Missing id" };

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("project_inquiries")
      .select("id, full_name, phone, email, project_type, description, budget_range, inspiration_images")
      .eq("id", inquiryId)
      .single();

    if (error || !data) {
      console.error("[notify-lead] could not load inquiry", error);
      return { error: "Inquiry not found" };
    }

    const result = await sendLeadNotificationEmail(data as LeadNotification);
    if (result.error) return { error: result.error };
    return { ok: true };
  } catch (err) {
    console.error("[notify-lead] unexpected error", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
