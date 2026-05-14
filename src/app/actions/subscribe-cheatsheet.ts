"use server";

import { Resend } from "resend";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { buildCheatsheetEmail } from "@/lib/email-cheatsheet";

const FROM = process.env.RESEND_FROM || "Domustack <onboarding@resend.dev>";

let resend: Resend | null = null;
function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resend) resend = new Resend(key);
  return resend;
}

function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

export type SubscribeResult =
  | { ok: true; alreadySubscribed?: boolean }
  | { error: string };

export async function subscribeToCheatsheetAction(input: {
  email: string;
  variant?: string;
  city?: string;
  zipCode?: string;
}): Promise<SubscribeResult> {
  const email = (input.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const supabase = createAdminSupabaseClient();

    // Upsert subscriber. ON CONFLICT (email) keeps the original signup, but
    // refreshes city/variant/zip in case they're filled this time.
    const { data: existing } = await supabase
      .from("email_subscribers")
      .select("id, drip_step")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // Already subscribed — do NOT resend the welcome email; respect their inbox.
      await supabase
        .from("email_subscribers")
        .update({
          variant: input.variant ?? null,
          city: input.city ?? null,
          zip_code: input.zipCode ?? null,
        })
        .eq("id", existing.id);
      return { ok: true, alreadySubscribed: true };
    }

    const { error: insertErr } = await supabase
      .from("email_subscribers")
      .insert({
        email,
        source: "exit_intent_popup",
        variant: input.variant ?? null,
        city: input.city ?? null,
        zip_code: input.zipCode ?? null,
        drip_step: 1,
        // drip_next_at: future cron-driven follow-ups (Day 1 / 2 / 3 / 4) will
        // pull rows where drip_next_at <= now() AND drip_step < 5.
        drip_next_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

    if (insertErr) {
      console.error("[subscribe-cheatsheet] insert", insertErr);
      return { error: "Could not save your email. Try again in a moment." };
    }

    // Send the welcome cheatsheet right now.
    const r = client();
    if (!r) {
      console.warn("[subscribe-cheatsheet] RESEND_API_KEY missing — subscriber saved, no email sent");
      return { ok: true };
    }
    const { subject, html, text } = buildCheatsheetEmail();
    const { error: sendErr } = await r.emails.send({
      from: FROM,
      to: email,
      subject,
      html,
      text,
    });
    if (sendErr) {
      console.error("[subscribe-cheatsheet] resend", sendErr);
      // Subscriber row is already saved, so just report a soft success — the
      // welcome can be retried by a future cron if we want.
    }

    return { ok: true };
  } catch (err) {
    console.error("[subscribe-cheatsheet] unexpected", err);
    return {
      error: err instanceof Error ? err.message : "Something went wrong.",
    };
  }
}
