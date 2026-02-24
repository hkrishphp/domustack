import Navbar from "@/components/Navbar";
import ConversationsList from "@/components/ConversationsList";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { ConversationWithDetails } from "@/lib/supabase";

export default async function MessagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase.rpc("get_conversations", {
    p_user_id: user!.id,
  });

  const conversations = (data as ConversationWithDetails[] | null) ?? [];

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-card py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <h1 className="text-[32px] md:text-[48px] font-medium leading-tight mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground text-lg">
              Communicate with your contractors and the Domustack team.
            </p>
          </div>
        </section>

        {/* Messages List */}
        <section className="py-16">
          <div className="mx-auto max-w-[800px] px-6">
            <ConversationsList initialConversations={conversations} userId={user!.id} />
          </div>
        </section>
      </main>
    </>
  );
}
