"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import TeamList from "./components/TeamList";
import HistoryList from "./components/HistoryList";
import EditProfileModal from "./components/EditProfileModal";

type Tab = "team" | "history";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
  identity_verification_status: string | null;
};

type EmployerDetails = {
  company_name: string | null;
  industry: string | null;
  country: string | null;
  company_size: string | null;
  budget_range: string | null;
  hiring_categories: string[] | null;
} | null;

export type TeamMemberRow = {
  id: string;
  employer_id: string;
  user_id: string | null;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Inactive";
  invited_at: string;
  joined_at: string | null;
  profiles: { full_name: string } | { full_name: string }[] | null;
};

export type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  contracts:
    | {
        freelancer_id: string;
        jobs: { title: string } | { title: string }[] | null;
        profiles: { full_name: string } | { full_name: string }[] | null;
      }
    | {
        freelancer_id: string;
        jobs: { title: string } | { title: string }[] | null;
        profiles: { full_name: string } | { full_name: string }[] | null;
      }[]
    | null;
};

export type EmployerProfileData = {
  profile: Profile;
  details: EmployerDetails;
  team: TeamMemberRow[];
  reviews: ReviewRow[];
};

type ProfileRow = {
  full_name: string | null;
  avatar_url: string | null;
  identity_verification_status: string | null;
  employer_details:
    | {
        company_name: string | null;
        industry: string | null;
        country: string | null;
        company_size: string | null;
        budget_range: string | null;
        hiring_categories: string[] | null;
      }
    | {
        company_name: string | null;
        industry: string | null;
        country: string | null;
        company_size: string | null;
        budget_range: string | null;
        hiring_categories: string[] | null;
      }[]
    | null;
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function getEmployerProfile(
  userId: string,
): Promise<EmployerProfileData> {
  const supabase = createClient();

  const { data } = await supabase
    .from("profiles")
    .select(
      "full_name, avatar_url, identity_verification_status, employer_details ( company_name, industry, country, company_size, budget_range, hiring_categories )",
    )
    .eq("id", userId)
    .single();

  const row = data as ProfileRow | null;
  const details = firstOrSelf(row?.employer_details ?? null);

  const { data: teamData } = await supabase
    .from("team_members")
    .select(
      "id, employer_id, user_id, email, role, status, invited_at, joined_at, profiles ( full_name )",
    )
    .eq("employer_id", userId)
    .order("invited_at", { ascending: false });

  // TODO: wire up real reviews once the reviews/contracts schema is confirmed.
  const reviews: ReviewRow[] = [];

  return {
    profile: {
      full_name: row?.full_name ?? null,
      avatar_url: row?.avatar_url ?? null,
      identity_verification_status: row?.identity_verification_status ?? null,
    },
    details: details
      ? {
          company_name: details.company_name,
          industry: details.industry,
          country: details.country,
          company_size: details.company_size,
          budget_range: details.budget_range,
          hiring_categories: details.hiring_categories,
        }
      : null,
    team: (teamData ?? []) as TeamMemberRow[],
    reviews,
  };
}

export default function ProfilePage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("team");
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [data, setData] = useState<EmployerProfileData | null>(null);

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
        <div className="bg-white rounded-2xl p-5 sm:p-6 h-32" />
        <div className="mt-6 h-64 rounded-2xl bg-white" />
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
            onTeamChange={(team) =>
              setData((prev) => (prev ? { ...prev, team } : prev))
            }
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
          onSaved={(profile, details) =>
            setData((prev) => (prev ? { ...prev, profile, details } : prev))
          }
        />
      )}
    </div>
  );
}
