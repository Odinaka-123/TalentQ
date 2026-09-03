"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getNotificationPreferences,
  updateNotificationPreference,
  DEFAULT_PREFERENCES,
  type PreferenceColumn,
} from "@/lib/queries/notification-preferences";
import ToggleRow from "./ToggleRow";

type ToggleKey =
  | "newAiMatch"
  | "newMessage"
  | "milestoneUpdates"
  | "newApplication"
  | "newReview"
  | "weeklyDigest"
  | "marketingTips"
  | "notificationSounds";

const KEY_TO_COLUMN: Record<ToggleKey, PreferenceColumn> = {
  newAiMatch: "ai_match",
  newMessage: "new_message",
  milestoneUpdates: "milestone_updates",
  newApplication: "application_updates",
  newReview: "review",
  weeklyDigest: "weekly_digest",
  marketingTips: "marketing_tips",
  notificationSounds: "notification_sounds",
};

const inAppItems: { key: ToggleKey; title: string; description: string }[] = [
  {
    key: "newAiMatch",
    title: "New AI Match",
    description: "When a candidate matches your job post",
  },
  {
    key: "newMessage",
    title: "New Message",
    description: "When a candidate sends you a message",
  },
  {
    key: "milestoneUpdates",
    title: "Milestone Updates",
    description: "Escrow funded, approved, or released",
  },
  {
    key: "newApplication",
    title: "New Application",
    description: "When someone applies to your job",
  },
  {
    key: "newReview",
    title: "New Review",
    description: "When talent leaves a review",
  },
];

export default function NotificationTab() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    newAiMatch: DEFAULT_PREFERENCES.ai_match,
    newMessage: DEFAULT_PREFERENCES.new_message,
    milestoneUpdates: DEFAULT_PREFERENCES.milestone_updates,
    newApplication: DEFAULT_PREFERENCES.application_updates,
    newReview: DEFAULT_PREFERENCES.review,
    weeklyDigest: DEFAULT_PREFERENCES.weekly_digest,
    marketingTips: DEFAULT_PREFERENCES.marketing_tips,
    notificationSounds: DEFAULT_PREFERENCES.notification_sounds,
  });

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);
      setEmail(user.email ?? "");

      const prefs = await getNotificationPreferences(user.id);
      setToggles({
        newAiMatch: prefs.ai_match,
        newMessage: prefs.new_message,
        milestoneUpdates: prefs.milestone_updates,
        newApplication: prefs.application_updates,
        newReview: prefs.review,
        weeklyDigest: prefs.weekly_digest,
        marketingTips: prefs.marketing_tips,
        notificationSounds: prefs.notification_sounds,
      });
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setToggle = (key: ToggleKey, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
    if (userId) {
      updateNotificationPreference(userId, KEY_TO_COLUMN[key], value).catch(
        () => {
          // revert on failure
          setToggles((prev) => ({ ...prev, [key]: !value }));
        },
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
        <h3 className="text-base font-semibold text-[#1F2A22]">
          In-App Notifications
        </h3>
        <p className="text-xs text-[#8A8A7E] mb-2">
          Choose what appears in your notification panel
        </p>

        <div className="flex flex-col divide-y divide-[#EFEBE2]">
          {inAppItems.map((item) => (
            <ToggleRow
              key={item.key}
              title={item.title}
              description={item.description}
              checked={toggles[item.key]}
              onChange={(v) => setToggle(item.key, v)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
        <h3 className="text-base font-semibold text-[#1F2A22]">
          Email Notifications
        </h3>
        <p className="text-xs text-[#8A8A7E] mb-2">
          {email ? `Sent to ${email}` : "Loading…"}
        </p>

        <div className="flex flex-col divide-y divide-[#EFEBE2]">
          <ToggleRow
            title="Weekly digest"
            description="Summary of your activity, matches, and earnings"
            checked={toggles.weeklyDigest}
            onChange={(v) => setToggle("weeklyDigest", v)}
          />
          <ToggleRow
            title="Marketing & tips"
            description="Platform news, feature updates, and freelancing tips"
            checked={toggles.marketingTips}
            onChange={(v) => setToggle("marketingTips", v)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
        <h3 className="text-base font-semibold text-[#1F2A22] mb-2">Sound</h3>

        <ToggleRow
          title="Notification sounds"
          description="Play a sound for new messages and alerts"
          checked={toggles.notificationSounds}
          onChange={(v) => setToggle("notificationSounds", v)}
        />
      </div>
    </div>
  );
}
