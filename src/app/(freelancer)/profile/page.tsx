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
      <div className="animate-pulse">
        <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#EDEAE1] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-5 w-48 rounded bg-[#EDEAE1] mb-2" />
            <div className="h-3.5 w-64 max-w-full rounded bg-[#F0ECE3] mb-3" />
            <div className="flex gap-4">
              <div className="h-3 w-20 rounded bg-[#F0ECE3]" />
              <div className="h-3 w-20 rounded bg-[#F0ECE3]" />
              <div className="h-3 w-20 rounded bg-[#F0ECE3]" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-full bg-[#EDEAE1] shrink-0" />
        </div>

        <div className="mt-6">
          <div className="flex gap-2 mb-5">
            <div className="h-8 w-24 rounded-full bg-[#EDEAE1]" />
            <div className="h-8 w-20 rounded-full bg-[#F0ECE3]" />
            <div className="h-8 w-24 rounded-full bg-[#F0ECE3]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="h-32 bg-[#EDEAE1]" />
                <div className="p-4">
                  <div className="h-4 w-3/4 rounded bg-[#EDEAE1] mb-2" />
                  <div className="h-3 w-1/2 rounded bg-[#F0ECE3]" />
                </div>
              </div>
            ))}
          </div>
        </div>
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
