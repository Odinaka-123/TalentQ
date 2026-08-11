"use client";

import { useState } from "react";
import ToggleRow from "./ToggleRow";

type ToggleKey =
  | "newMessages"
  | "proposalUpdates"
  | "milestoneReleased"
  | "jobMatches"
  | "reviewRequests"
  | "weeklyDigest"
  | "marketingTips"
  | "notificationSounds";

const inAppItems: { key: ToggleKey; title: string; description: string }[] = [
  {
    key: "newMessages",
    title: "New messages",
    description: "When a client sends you a message",
  },
  {
    key: "proposalUpdates",
    title: "Proposal updates",
    description: "Shortlisted, accepted, or declined",
  },
  {
    key: "milestoneReleased",
    title: "Milestone released",
    description: "When escrow funds are released to your wallet",
  },
  {
    key: "jobMatches",
    title: "Job matches",
    description: "AI-matched jobs above 85% score",
  },
  {
    key: "reviewRequests",
    title: "Review requests",
    description: "When a contract ends and a review is due",
  },
];

export default function NotificationTab() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    newMessages: true,
    proposalUpdates: true,
    milestoneReleased: true,
    jobMatches: true,
    reviewRequests: false,
    weeklyDigest: true,
    marketingTips: false,
    notificationSounds: true,
  });

  const setToggle = (key: ToggleKey, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
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
        <p className="text-xs text-[#8A8A7E] mb-2">Sent to henny@email.com</p>

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
