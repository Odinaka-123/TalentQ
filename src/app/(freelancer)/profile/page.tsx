"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileSetupPrompt from "./components/ProfileSetupPrompt";
import ProfileTabs from "./components/ProfileTabs";
import PortfolioGrid from "./components/PortfolioGrid";
import SkillsList from "./components/SkillsList";
import HistoryList from "./components/HistoryList";
import { createClient } from "@/lib/supabase/client";
import { getFreelancerProfile } from "@/lib/queries/profile";

type Tab = "portfolio" | "skills" | "history";

export default function ProfilePage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getFreelancerProfile>
  > | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const result = await getFreelancerProfile(user.id);
      setData(result);
      setLoading(false);
    };

    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="text-center py-16 text-sm text-[#8A8A7E]">
        Loading profile...
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div className="text-center py-16 text-sm text-[#8A8A7E]">
        Profile not found.
      </div>
    );
  }

  const isIncomplete = !data.details?.headline;

  return (
    <div>
      {isIncomplete ?
        <ProfileSetupPrompt />
      : <ProfileHeader profile={data.profile} details={data.details} />}

      <div className="mt-6">
        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "portfolio" && <PortfolioGrid items={data.portfolio} />}
        {activeTab === "skills" && <SkillsList skills={data.skills} />}
        {activeTab === "history" && <HistoryList reviews={data.reviews} />}
      </div>
    </div>
  );
}
