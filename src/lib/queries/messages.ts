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

export type MessageReaction = {
  emoji: string;
  userId: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
  replyToMessageId: string | null;
  reactions: MessageReaction[];
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

export async function getOrCreateConversation(
  userId1: string,
  userId2: string,
): Promise<string> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(participant_one.eq.${userId1},participant_two.eq.${userId2}),and(participant_one.eq.${userId2},participant_two.eq.${userId1})`,
    )
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      participant_one: userId1,
      participant_two: userId2,
    })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Failed to create conversation");
  }

  return created.id;
}

export async function getMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from("messages")
    .select(
      "id, sender_id, content, created_at, deleted_at, reply_to_message_id",
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const messages = data ?? [];
  const messageIds = messages.map((m) => m.id);

  const { data: reactionRows } =
    messageIds.length > 0 ?
      await supabase
        .from("message_reactions")
        .select("message_id, user_id, emoji")
        .in("message_id", messageIds)
    : { data: [] };

  const reactionsByMessage = new Map<string, MessageReaction[]>();
  (reactionRows ?? []).forEach((r) => {
    const list = reactionsByMessage.get(r.message_id) ?? [];
    list.push({ emoji: r.emoji, userId: r.user_id });
    reactionsByMessage.set(r.message_id, list);
  });

  return messages.map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    content: m.content,
    createdAt: m.created_at,
    deletedAt: m.deleted_at,
    replyToMessageId: m.reply_to_message_id,
    reactions: reactionsByMessage.get(m.id) ?? [],
  }));
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  replyToMessageId?: string | null,
) {
  const res = await fetch("/api/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId,
      content,
      replyToMessageId: replyToMessageId ?? null,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to send message");
  }

  return res.json();
}

export async function deleteMessage(messageId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("messages")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", messageId);

  if (error) throw error;
}

export async function toggleReaction(
  messageId: string,
  userId: string,
  emoji: string,
): Promise<void> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("message_reactions")
    .select("id")
    .eq("message_id", messageId)
    .eq("user_id", userId)
    .eq("emoji", emoji)
    .maybeSingle();

  if (existing) {
    await supabase.from("message_reactions").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("message_reactions")
      .insert({ message_id: messageId, user_id: userId, emoji });
  }
}

export async function markConversationRead(
  conversationId: string,
  userId: string,
) {
  const supabase = createClient();
  return supabase.from("conversation_reads").upsert({
    conversation_id: conversationId,
    user_id: userId,
    last_read_at: new Date().toISOString(),
  });
}

export async function getOtherParticipantLastRead(
  conversationId: string,
  otherUserId: string,
): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("conversation_reads")
    .select("last_read_at")
    .eq("conversation_id", conversationId)
    .eq("user_id", otherUserId)
    .maybeSingle();

  return data?.last_read_at ?? null;
}

export function subscribeToMessages(
  conversationId: string,
  handlers: {
    onInsert?: (message: ChatMessage) => void;
    onUpdate?: (message: ChatMessage) => void;
  },
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
        handlers.onInsert?.({
          id: m.id,
          senderId: m.sender_id,
          content: m.content,
          createdAt: m.created_at,
          deletedAt: m.deleted_at ?? null,
          replyToMessageId: m.reply_to_message_id ?? null,
          reactions: [],
        });
      },
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const m = payload.new;
        handlers.onUpdate?.({
          id: m.id,
          senderId: m.sender_id,
          content: m.content,
          createdAt: m.created_at,
          deletedAt: m.deleted_at ?? null,
          replyToMessageId: m.reply_to_message_id ?? null,
          reactions: [],
        });
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToReactions(
  onChange: (change: {
    type: "INSERT" | "DELETE";
    messageId: string;
    userId: string;
    emoji: string;
  }) => void,
) {
  const supabase = createClient();

  const channel = supabase
    .channel("message_reactions")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "message_reactions" },
      (payload) => {
        const r = payload.new;
        onChange({
          type: "INSERT",
          messageId: r.message_id,
          userId: r.user_id,
          emoji: r.emoji,
        });
      },
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "message_reactions" },
      (payload) => {
        const r = payload.old;
        onChange({
          type: "DELETE",
          messageId: r.message_id,
          userId: r.user_id,
          emoji: r.emoji,
        });
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToReadReceipts(
  conversationId: string,
  onChange: (lastReadAt: string) => void,
) {
  const supabase = createClient();

  const channel = supabase
    .channel(`conversation_reads:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversation_reads",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const row = payload.new as { last_read_at?: string } | null;
        if (row?.last_read_at) onChange(row.last_read_at);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
