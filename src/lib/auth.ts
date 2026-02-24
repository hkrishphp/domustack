import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function syncUserToDatabase(supabase: SupabaseClient, user: User) {
  return supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email!,
      full_name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email!.split("@")[0],
      avatar_url: user.user_metadata?.avatar_url || null,
    },
    { onConflict: "id" }
  );
}
