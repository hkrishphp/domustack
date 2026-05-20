// Daily health check for the lead funnel. Runs once per day via Vercel Cron.
//
// What it verifies:
//   1. Anonymous visitors can still INSERT into project_inquiries (the exact
//      thing that silently broke last week). End-to-end test using the public
//      anon key, then cleans up the test row immediately.
//   2. Counts real leads in the last 24h (FYI in the response).
//
// Sends a Resend alert email to ADMIN_NOTIFICATION_EMAILS if any check fails.
// Authenticated via Bearer <CRON_SECRET>. Vercel Cron sends this header
// automatically when the env var is set.

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";

const HEALTH_EMAIL = "__healthcheck__@domustack.internal";
const HEALTH_NAME = "__HEALTH_CHECK__";
const FROM = process.env.RESEND_FROM || "Domustack <onboarding@resend.dev>";
const ALERT_TO = (process.env.ADMIN_NOTIFICATION_EMAILS || "david@purpleheartpros.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  // ── 1. Auth gate ────────────────────────────────────────────────────────
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` on every scheduled
  // request. If CRON_SECRET isn't set we let it through (e.g. for local curl).
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  const issues: string[] = [];
  const supabase = createAdminSupabaseClient();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // ── 2. End-to-end anon INSERT test ──────────────────────────────────────
  if (!anonKey || !supabaseUrl) {
    issues.push("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  } else {
    try {
      // Use the same path the browser would: anon REST insert.
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/project_inquiries`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: HEALTH_NAME,
          phone: "(555) 000-0000",
          email: HEALTH_EMAIL,
          project_type: "Health Check",
          description: "Automated daily health check — auto-deleted",
          budget_range: "Under $5,000",
          inspiration_images: [],
        }),
      });

      if (!insertRes.ok) {
        const body = (await insertRes.text()).slice(0, 300);
        issues.push(
          `Anonymous INSERT into project_inquiries FAILED (HTTP ${insertRes.status}): ${body}`
        );
      }
    } catch (err) {
      issues.push(
        `Anonymous INSERT threw: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    // Always try cleanup even if the insert reported failure — there might
    // be orphans from prior runs.
    try {
      await supabase.from("project_inquiries").delete().eq("email", HEALTH_EMAIL);
    } catch (err) {
      // Cleanup failing isn't critical, but mention it.
      issues.push(
        `Cleanup of health-check row failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  // ── 3. Count real leads in last 24h (informational) ─────────────────────
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let leadsLast24h = 0;
  const { count, error: countErr } = await supabase
    .from("project_inquiries")
    .select("*", { count: "exact", head: true })
    .gte("created_at", since)
    .neq("status", "spam")
    .neq("email", HEALTH_EMAIL);
  if (countErr) {
    issues.push(`Could not count recent leads: ${countErr.message}`);
  } else {
    leadsLast24h = count ?? 0;
  }

  const report = {
    timestamp: new Date().toISOString(),
    ok: issues.length === 0,
    issues,
    leads_last_24h: leadsLast24h,
  };

  // ── 4. Send alert email if anything failed ──────────────────────────────
  if (issues.length > 0) {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && ALERT_TO.length > 0) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: FROM,
          to: ALERT_TO,
          subject: `🚨 Domustack health check FAILED — ${issues.length} issue${issues.length === 1 ? "" : "s"}`,
          text: [
            `Domustack daily health check failed at ${report.timestamp}.`,
            ``,
            `ISSUES:`,
            ...issues.map((i) => `  • ${i}`),
            ``,
            `Real leads in last 24h (excluding test rows): ${leadsLast24h}`,
            ``,
            `Admin dashboard: https://www.domustack.com/admin`,
            ``,
            `Most common fix when anon INSERT breaks: re-run the RLS policy SQL from`,
            `supabase/migrations/009_project_inquiries.sql in the Supabase SQL editor.`,
          ].join("\n"),
        });
      } catch (err) {
        console.error("[health-check] alert email send failed", err);
      }
    } else {
      console.warn("[health-check] issues detected but RESEND_API_KEY missing — no alert sent", issues);
    }
  }

  // Logs visible in Vercel function logs.
  console.log("[health-check]", JSON.stringify(report));

  return NextResponse.json(report);
}
