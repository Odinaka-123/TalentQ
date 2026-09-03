import { createClient } from "@/lib/supabase/client";

export type PreferenceColumn =
  | "new_message"
  | "application_updates"
  | "milestone_updates"
  | "ai_match"
  | "review"
  | "weekly_digest"
  | "marketing_tips"
  | "notification_sounds";

export type NotificationPreferences = Record<PreferenceColumn, boolean>;

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  new_message: true,
  application_updates: true,
  milestone_updates: true,
  ai_match: true,
  review: false,
  weekly_digest: true,
  marketing_tips: false,
  notification_sounds: true,
};

export async function getNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences> {
  const supabase = createClient();

  const { data } = await supabase
    .from("notification_preferences")
    .select(
      "new_message, application_updates, milestone_updates, ai_match, review, weekly_digest, marketing_tips, notification_sounds",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return DEFAULT_PREFERENCES;

  return {
    new_message: data.new_message,
    application_updates: data.application_updates,
    milestone_updates: data.milestone_updates,
    ai_match: data.ai_match,
    review: data.review,
    weekly_digest: data.weekly_digest,
    marketing_tips: data.marketing_tips,
    notification_sounds: data.notification_sounds,
  };
}

export async function updateNotificationPreference(
  userId: string,
  column: PreferenceColumn,
  value: boolean,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("notification_preferences")
    .upsert(
      { user_id: userId, [column]: value, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );

  if (error) throw error;
}
