import { createClient } from "@/lib/supabase/client";

export type ConversationSummary = {
  id: string;
  otherUserId: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export async function getConversations(
  userId: string,
): Promise<ConversationSummary[]> {
  const supabase = createClient();

  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      `
      id, participant_one, participant_two, created_at,
      p1:profiles!conversations_participant_one_fkey ( id, full_name, avatar_url ),
      p2:profiles!conversations_participant_two_fkey ( id, full_name, avatar_url )
    `,
    )
    .or(`participant_one.eq.${userId},participant_two.eq.${userId}`);

  if (!conversations || conversations.length === 0) return [];

  const conversationIds = conversations.map((c) => c.id);

  const { data: allMessages } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, content, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });

  const { data: reads } = await supabase
    .from("conversation_reads")
    .select("conversation_id, last_read_at")
    .eq("user_id", userId);

  const readMap = new Map(
    (reads ?? []).map((r) => [r.conversation_id, r.last_read_at]),
  );

  return conversations
    .map((c): ConversationSummary => {
      const p1 = Array.isArray(c.p1) ? c.p1[0] : c.p1;
      const p2 = Array.isArray(c.p2) ? c.p2[0] : c.p2;
      const other = c.participant_one === userId ? p2 : p1;

      const messagesForThis = (allMessages ?? []).filter(
        (m) => m.conversation_id === c.id,
      );
      const latest = messagesForThis[0];

      const lastReadAt = readMap.get(c.id);
      const unread =
        latest ?
          latest.sender_id !== userId &&
          (!lastReadAt || new Date(latest.created_at) > new Date(lastReadAt))
        : false;

      return {
        id: c.id,
        otherUserId: other?.id ?? "",
        name: other?.full_name ?? "Unknown",
        avatarUrl: other?.avatar_url ?? null,
        lastMessage: latest?.content ?? "No messages yet",
        lastMessageAt: latest?.created_at ?? c.created_at,
        unread,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime(),
    );
}

export async function getMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return (data ?? []).map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    content: m.content,
    createdAt: m.created_at,
  }));
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
) {
  const supabase = createClient();
  return supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
  });
}

export async function markConversationRead(
  conversationId: string,
  userId: string,
) {
  const supabase = createClient();
  return supabase
    .from("conversation_reads")
    .upsert({
      conversation_id: conversationId,
      user_id: userId,
      last_read_at: new Date().toISOString(),
    });
}

export function subscribeToMessages(
  conversationId: string,
  onInsert: (message: ChatMessage) => void,
) {
  const supabase = createClient();

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const m = payload.new;
        onInsert({
          id: m.id,
          senderId: m.sender_id,
          content: m.content,
          createdAt: m.created_at,
        });
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
