import { createClient } from "@/lib/supabase/client";

export type TeamMemberRow = {
  id: string;
  email: string;
  role: string;
  status: "Pending" | "Active" | "Inactive";
  invited_at: string;
  profiles: { full_name: string } | { full_name: string }[] | null;
};

export async function getEmployerProfile(userId: string) {
  const supabase = createClient();

  const [profileRes, detailsRes, reviewsRes, teamRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),

    supabase.from("employer_details").select("*").eq("id", userId).single(),

    supabase
      .from("reviews")
      .select(
        `
        id, rating, comment, created_at,
        contracts!inner (
          freelancer_id,
          jobs ( title ),
          profiles!contracts_freelancer_id_fkey ( full_name )
        )
      `,
      )
      .eq("reviewee_id", userId)
      .order("created_at", { ascending: false }),

    supabase
      .from("team_members")
      .select("id, email, role, status, invited_at, profiles(full_name)")
      .eq("employer_id", userId)
      .order("invited_at", { ascending: false }),
  ]);

  return {
    profile: profileRes.data,
    details: detailsRes.data,
    reviews: reviewsRes.data ?? [],
    team: (teamRes.data ?? []) as TeamMemberRow[],
  };
}
