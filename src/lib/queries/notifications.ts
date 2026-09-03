import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PreferenceColumn } from "@/lib/queries/notification-preferences";

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

const TYPE_TO_PREFERENCE_COLUMN: Record<string, PreferenceColumn> = {
  message: "new_message",
  contract_created: "milestone_updates",
  milestone_funded: "milestone_updates",
  invited: "application_updates",
  application_interviewing: "application_updates",
  application_offer_sent: "application_updates",
  application_hired: "application_updates",
  application_rejected: "application_updates",
  application_submitted: "application_updates",
};

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
 * Live-updates the bell the moment a new notification row is inserted for
 * this user — e.g. the message trigger firing, or a future withdrawal/
 * milestone event — without requiring a page refresh or polling.
 * Requires Realtime to be enabled for the `notifications` table in
 * Supabase (Database → Replication).
 */
export function subscribeToNotifications(
  userId: string,
  onInsert: (notification: Notification) => void,
) {
  const supabase = createClient();

  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const n = payload.new;
        onInsert({
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          link: n.link,
          read: n.read,
          created_at: n.created_at,
        });
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Server-side helper for creating a notification from within API routes.
 * Pass the route's own request-scoped Supabase client (cookie-based, tied
 * to the acting user's session) — since RLS only allows inserting rows
 * where user_id matches the caller, this only ever works for creating a
 * notification for yourself, which matches every current use case
 * (e.g. the withdraw route notifying the same user who triggered it).
 *
 * Before inserting, checks the recipient's notification_preferences row
 * (if one exists) for the category this notification type maps to, and
 * silently skips the insert if that category is turned off. Types with no
 * mapping (e.g. features without a preference toggle yet) always send.
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
  const column = TYPE_TO_PREFERENCE_COLUMN[params.type];

  if (column) {
    const { data: pref } = await supabase
      .from("notification_preferences")
      .select(column)
      .eq("user_id", params.userId)
      .maybeSingle();

    const value = (pref as Record<string, boolean> | null)?.[column];
    if (value === false) return;
  }

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
