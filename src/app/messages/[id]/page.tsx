"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createBrowserSupabaseClient, type Message } from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/utils";

type Participant = {
  name: string;
  avatar: string;
};

export default function MessageThreadPage() {
  const { id: conversationId } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch user, messages, and participant info
  useEffect(() => {
    async function init() {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/sign-in");
        return;
      }

      setUserId(user.id);

      // Fetch messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (msgs) setMessages(msgs);

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id);

      // Fetch participant info (the other person in the conversation)
      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("user_id, contractor_id, users(full_name), contractors(name)")
        .eq("conversation_id", conversationId);

      if (participants) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const other = (participants as any[]).find(
          (p) => p.user_id !== user.id || p.contractor_id !== null
        );
        if (other) {
          const contractorName = Array.isArray(other.contractors)
            ? other.contractors[0]?.name
            : other.contractors?.name;
          const userName = Array.isArray(other.users)
            ? other.users[0]?.full_name
            : other.users?.full_name;
          const name = contractorName || userName || "Unknown";
          setParticipant({
            name,
            avatar: name.charAt(0).toUpperCase(),
          });
        }
      }

      setLoading(false);
    }

    init();
  }, [conversationId, router]);

  // Realtime subscription for new messages
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const channel = supabase
      .channel(`thread-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Mark as read if not from current user
          if (userId && newMsg.sender_id !== userId) {
            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !userId || sending) return;

    setSending(true);
    const supabase = createBrowserSupabaseClient();

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: newMessage.trim(),
    });

    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    setNewMessage("");
    setSending(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading conversation...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-card py-6 border-b border-border">
          <div className="mx-auto max-w-[800px] px-6">
            <Link
              href="/messages"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-4"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Messages
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {participant?.avatar || "?"}
                </span>
              </div>
              <h1 className="text-xl font-medium">
                {participant?.name || "Conversation"}
              </h1>
            </div>
          </div>
        </section>

        {/* Messages */}
        <section className="py-6">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="space-y-4 mb-6 min-h-[400px] max-h-[500px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No messages yet. Start the conversation!
                </p>
              )}
              {messages.map((msg) => {
                const isMe = msg.sender_id === userId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border text-foreground rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p
                        className={`text-[11px] mt-1 ${
                          isMe
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatRelativeTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Send message form */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-3 bg-card border border-border rounded-[var(--radius)] p-2"
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-[var(--radius)] text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
              >
                {sending ? "..." : "Send"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
