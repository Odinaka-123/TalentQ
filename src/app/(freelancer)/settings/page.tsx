"use client";

import { useState } from "react";
import SettingsTabs from "./components/SettingsTabs";
import AccountsTab from "./components/AccountsTab";
import NotificationTab from "./components/NotificationTab";
import AppearanceTab from "./components/AppearanceTab";

type Tab = "accounts" | "notification" | "appearance" | "privacy";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("accounts");

  return (
    <div>

      <SettingsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "accounts" && <AccountsTab />}
      {activeTab === "notification" && <NotificationTab />}
      {activeTab === "appearance" && <AppearanceTab />}
      {activeTab === "privacy" && (
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
          Privacy settings — coming next
        </div>
      )}
    </div>
  );
}
