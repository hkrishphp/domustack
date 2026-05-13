"use server";

import { createAdminSupabaseClient } from "@/lib/supabase-admin";

export type RecentMatch = {
  name: string;       // first name only
  city: string;       // city or state fallback
  project: string;    // project_type
  minsAgo: number;    // computed from created_at
};

const FRESH_WINDOW_MIN = 7 * 24 * 60; // 7 days — older than this is hidden entirely
const FETCH_LIMIT = 30;

/**
 * Returns a list of recent (≤ 3 day old) project inquiries, anonymized for
 * public display. Only first name, city/state, project type, and a relative
 * "minutes ago" value leave the server. No phone, email, address, or
 * description ever returned.
 *
 * If the table query fails or returns nothing, an empty array is returned —
 * the client falls back to a "be one of the first" message in that case.
 */
export async function getRecentMatchesAction(): Promise<RecentMatch[]> {
  try {
    const supabase = createAdminSupabaseClient();
    const sinceIso = new Date(Date.now() - FRESH_WINDOW_MIN * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("project_inquiries")
      .select("full_name, city, state, project_type, created_at, status")
      .gte("created_at", sinceIso)
      .neq("status", "spam")
      .order("created_at", { ascending: false })
      .limit(FETCH_LIMIT);

    if (error || !data) return [];

    const now = Date.now();
    return data
      .map((row) => {
        const minsAgo = Math.max(1, Math.round((now - new Date(row.created_at).getTime()) / 60000));
        // Drop anything older than the freshness window even if the query slipped one in.
        if (minsAgo > FRESH_WINDOW_MIN) return null;

        const firstName = (row.full_name || "").trim().split(/\s+/)[0] || "Someone";
        const city = (row.city || row.state || "").trim();
        return {
          name: firstName,
          city,
          project: row.project_type || "Renovation",
          minsAgo,
        } satisfies RecentMatch;
      })
      .filter((m): m is RecentMatch => m !== null && Boolean(m.city));
  } catch (err) {
    console.warn("[recent-matches] failed", err);
    return [];
  }
}
