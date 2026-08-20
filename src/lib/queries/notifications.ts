import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

const RECENT_LIMIT = 20;

export async function getNotifications(
  userId: string,
): Promise<Notification[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from("notifications")
    .select("id, type, title, body, link, read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(RECENT_LIMIT);

  return data ?? [];
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("notifications").update({ read: true }).eq("id", id);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
}

/**
 * Server-side helper for creating a notification from within API routes.
 * Pass the route's own request-scoped Supabase client (cookie-based, tied
 * to the acting user's session) — since RLS only allows inserting rows
 * where user_id matches the caller, this only ever works for creating a
 * notification for yourself, which matches every current use case
 * (e.g. the withdraw route notifying the same user who triggered it).
 */
export async function createNotification(
  supabase: SupabaseClient,
  params: {
    userId: string;
    type: string;
    title: string;
    body?: string;
    link?: string;
  },
): Promise<void> {
  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body ?? null,
    link: params.link ?? null,
  });

  if (error) {
    // Notifications are a nice-to-have, not critical path — log but don't
    // throw, so a notification failure never fails the action that
    // triggered it (e.g. a successful withdrawal shouldn't error out just
    // because its notification couldn't be written).
    console.error("Failed to create notification:", error);
  }
}
