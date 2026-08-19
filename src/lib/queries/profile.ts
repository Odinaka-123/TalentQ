import { createClient } from "@/lib/supabase/client";

type SkillRow = {
  skills: { name: string } | { name: string }[] | null;
};

export async function getFreelancerProfile(userId: string) {
  const supabase = createClient();

  const [profileRes, detailsRes, skillsRes, portfolioRes, reviewsRes] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("freelancer_details").select("*").eq("id", userId).single(),
      supabase
        .from("freelancer_skills")
        .select("skills(name)")
        .eq("freelancer_id", userId),
      supabase
        .from("portfolio_items")
        .select("*")
        .eq("freelancer_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select(
          `
          id, rating, comment, created_at,
          contracts!inner (
            employer_id,
            jobs ( title ),
            profiles!contracts_employer_id_fkey ( full_name )
          )
        `,
        )
        .eq("reviewee_id", userId)
        .order("created_at", { ascending: false }),
    ]);

  const skills = ((skillsRes.data ?? []) as SkillRow[])
    .map((row) =>
      Array.isArray(row.skills) ? row.skills[0]?.name : row.skills?.name,
    )
    .filter((name): name is string => Boolean(name));

  return {
    profile: profileRes.data,
    details: detailsRes.data,
    skills,
    portfolio: portfolioRes.data ?? [],
    reviews: reviewsRes.data ?? [],
  };
}
