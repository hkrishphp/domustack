import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Find an existing conversation between a user and a contractor,
 * or create a new one. Then send an initial message.
 * Returns the conversation ID.
 */
export async function startConversation(
  supabase: SupabaseClient,
  userId: string,
  contractorId: string,
  initialMessage: string
): Promise<string | null> {
  // Check if a conversation already exists between this user and contractor
  const { data: existing } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  if (existing && existing.length > 0) {
    // Check if any of those conversations also have this contractor
    const convIds = existing.map((e) => e.conversation_id);
    const { data: match } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("contractor_id", contractorId)
      .in("conversation_id", convIds)
      .limit(1);

    if (match && match.length > 0) {
      // Existing conversation found — send message there
      const conversationId = match[0].conversation_id;

      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: userId,
        content: initialMessage,
      });

      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      return conversationId;
    }
  }

  // No existing conversation — create a new one
  const { data: newConvo, error: convoError } = await supabase
    .from("conversations")
    .insert({ updated_at: new Date().toISOString() })
    .select("id")
    .single();

  if (convoError || !newConvo) return null;

  const conversationId = newConvo.id;

  // Add participants: the user and the contractor
  await supabase.from("conversation_participants").insert([
    { conversation_id: conversationId, user_id: userId, contractor_id: null },
    { conversation_id: conversationId, user_id: null, contractor_id: contractorId },
  ]);

  // Send the initial message
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: userId,
    content: initialMessage,
  });

  return conversationId;
}
