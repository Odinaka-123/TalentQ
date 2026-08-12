"use client";

import { useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import TeamList from "./components/TeamList";
import HistoryList from "./components/HistoryList";

type Tab = "team" | "history";

export default function EmployerProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("team");

  return (
    <div>
      <ProfileHeader />

      <div className="mt-6">
        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "team" && <TeamList />}
        {activeTab === "history" && <HistoryList />}
      </div>
    </div>
  );
}
