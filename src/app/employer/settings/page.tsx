"use client";

import { useState } from "react";
import SettingsTabs from "./components/SettingsTabs";
import AccountsTab from "./components/AccountsTab";
import NotificationTab from "./components/NotificationTab";
import AppearanceTab from "./components/AppearanceTab";

type Tab = "accounts" | "notification" | "appearance";

export default function EmployerSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("accounts");

  return (
    <div>
      <SettingsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "accounts" && <AccountsTab />}
      {activeTab === "notification" && <NotificationTab />}
      {activeTab === "appearance" && <AppearanceTab />}
    </div>
  );
}
