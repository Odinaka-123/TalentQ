"use client";

import { useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import PortfolioGrid from "./components/PortfolioGrid";
import SkillsList from "./components/SkillsList";
import HistoryList from "./components/HistoryList";

type Tab = "portfolio" | "skills" | "history";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");

  return (
    <div>
      <ProfileHeader />

      <div className="mt-6">
        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "portfolio" && <PortfolioGrid />}
        {activeTab === "skills" && <SkillsList />}
        {activeTab === "history" && <HistoryList />}
      </div>
    </div>
  );
}
