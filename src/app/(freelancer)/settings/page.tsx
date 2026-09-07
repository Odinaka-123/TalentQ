"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import SettingsTabs from "./components/SettingsTabs";
import AccountsTab from "./components/AccountsTab";
import NotificationTab from "./components/NotificationTab";
import AppearanceTab from "./components/AppearanceTab";

type Tab = "accounts" | "notification" | "appearance" | "privacy";

export default function SettingsPage() {
    const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("accounts");

  return (
    <div>

      <SettingsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "accounts" && <AccountsTab />}
      {activeTab === "notification" && <NotificationTab />}
      {activeTab === "appearance" && <AppearanceTab />}
      {activeTab === "privacy" && (
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
          {t("app_freelancer_settings_page.privacy_settings_coming_next")}</div>
      )}
    </div>
  );
}
