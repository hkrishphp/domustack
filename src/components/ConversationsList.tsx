"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBrowserSupabaseClient,
  type ConversationWithDetails,
} from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/utils";

export default function ConversationsList({
  initialConversations,
  userId,
}: {
  initialConversations: ConversationWithDetails[];
  userId: string;
}) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async () => {
          // Re-fetch conversations on new message
          const { data } = await supabase.rpc("get_conversations", {
            p_user_id: userId,
          });
          if (data) setConversations(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="bg-card rounded-[var(--radius)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-border">
      {conversations.map((convo) => (
        <div
          key={convo.id}
          onClick={() => router.push(`/messages/${convo.id}`)}
          className="flex items-start gap-4 p-5 hover:bg-secondary/50 transition-colors cursor-pointer"
        >
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-semibold text-sm">
              {convo.participant_avatar}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3
                className={`text-sm truncate ${convo.unread_count > 0 ? "font-semibold" : "font-medium"}`}
              >
                {convo.participant_name}
              </h3>
              <span className="text-[12px] text-muted-foreground whitespace-nowrap">
                {formatRelativeTime(convo.last_message_at)}
              </span>
            </div>
            <p
              className={`text-[13px] truncate ${convo.unread_count > 0 ? "text-foreground" : "text-muted-foreground"}`}
            >
              {convo.last_message}
            </p>
          </div>

          {/* Unread badge */}
          {convo.unread_count > 0 && (
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center shrink-0 mt-1">
              {convo.unread_count}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
