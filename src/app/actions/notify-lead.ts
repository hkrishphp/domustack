"use server";

import { sendLeadNotificationEmail, type LeadNotification } from "@/lib/email";

/**
 * Sends an admin notification email for a freshly submitted lead.
 * Receives the lead data directly from the client (the table's RLS only
 * allows INSERT for anon, not SELECT, so we can't re-read the row).
 * Failures are logged but never block the homeowner's success state.
 */
export async function notifyLeadAction(
  lead: Omit<LeadNotification, "id">
): Promise<{ ok?: true; error?: string }> {
  try {
    const result = await sendLeadNotificationEmail(lead as LeadNotification);
    if (result.error) return { error: result.error };
    return { ok: true };
  } catch (err) {
    console.error("[notify-lead] unexpected error", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
