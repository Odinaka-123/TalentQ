"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import TeamList from "./components/TeamList";
import HistoryList from "./components/HistoryList";
import EditProfileModal from "./components/EditProfileModal";
import { createClient } from "@/lib/supabase/client";
import { getEmployerProfile } from "@/lib/queries/employer-profile";

type Tab = "team" | "history";
type EmployerProfileData = Awaited<ReturnType<typeof getEmployerProfile>>;

export default function EmployerProfilePage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>("team");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EmployerProfileData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      const result = await getEmployerProfile(user.id);
      setData(result);
      setLoading(false);
    };

    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EDEAE1] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-5 w-48 rounded bg-[#EDEAE1] mb-2" />
            <div className="h-3.5 w-40 rounded bg-[#F0ECE3] mb-3" />
            <div className="h-3 w-32 rounded bg-[#F0ECE3]" />
          </div>
          <div className="h-9 w-28 rounded-full bg-[#EDEAE1] shrink-0" />
        </div>

        <div className="mt-6">
          <div className="flex gap-2 mb-5">
            <div className="h-8 w-20 rounded-full bg-[#EDEAE1]" />
            <div className="h-8 w-20 rounded-full bg-[#F0ECE3]" />
          </div>
          <div className="bg-white rounded-2xl h-48" />
        </div>
      </div>
    );
  }

  if (!data?.profile || !userId) {
    return (
      <div className="text-center py-16 text-sm text-[#8A8A7E]">
        Profile not found.
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader
        userId={userId}
        profile={data.profile}
        details={data.details}
        onEdit={() => setEditOpen(true)}
      />

      <div className="mt-6">
        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "team" && (
          <TeamList
            employerId={userId}
            team={data.team}
            onTeamChange={(team) => setData({ ...data, team })}
          />
        )}
        {activeTab === "history" && <HistoryList reviews={data.reviews} />}
      </div>

      {editOpen && (
        <EditProfileModal
          userId={userId}
          profile={data.profile}
          details={data.details}
          onClose={() => setEditOpen(false)}
          onSaved={(profile, details) => {
            setData({
              ...data,
              profile: { ...data.profile, ...profile },
              details,
            });
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
}
