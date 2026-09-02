import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/queries/notifications";
import { messagesLink } from "@/lib/queries/notification-links";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId, content, replyToMessageId } = await req.json();
  const trimmed = (content ?? "").trim();

  if (!conversationId || !trimmed) {
    return NextResponse.json(
      { error: "conversationId and content are required" },
      { status: 400 },
    );
  }

  const { data: conversation, error: conversationError } = await admin
    .from("conversations")
    .select("id, participant_one, participant_two")
    .eq("id", conversationId)
    .single();

  if (conversationError || !conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }

  const isParticipant =
    conversation.participant_one === user.id ||
    conversation.participant_two === user.id;

  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const recipientId =
    conversation.participant_one === user.id
      ? conversation.participant_two
      : conversation.participant_one;

  const { data: message, error: messageError } = await admin
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: trimmed,
      reply_to_message_id: replyToMessageId ?? null,
    })
    .select("id, sender_id, content, created_at, deleted_at, reply_to_message_id")
    .single();

  if (messageError || !message) {
    return NextResponse.json(
      { error: messageError?.message ?? "Failed to send message" },
      { status: 500 },
    );
  }

  const [{ data: sender }, { data: recipient }] = await Promise.all([
    admin.from("profiles").select("full_name").eq("id", user.id).single(),
    admin.from("profiles").select("role").eq("id", recipientId).single(),
  ]);

  if (recipient) {
    await createNotification(admin, {
      userId: recipientId,
      type: "message",
      title: `New message from ${sender?.full_name ?? "someone"}`,
      body: trimmed.slice(0, 140),
      link: messagesLink(
        recipient.role as "employer" | "freelancer" | "admin",
        conversationId,
      ),
    });
  }

  return NextResponse.json({
    id: message.id,
    senderId: message.sender_id,
    content: message.content,
    createdAt: message.created_at,
    deletedAt: message.deleted_at,
    replyToMessageId: message.reply_to_message_id,
    reactions: [],
  });
}
