import { createClient } from "@/lib/supabase/client";

export type FreelancerPublicProfile = {
  freelancerId: string;
  name: string;
  avatarUrl: string | null;
  headline: string;
  identityVerified: boolean;
  skills: string[];
  portfolio: {
    id: string;
    title: string;
    image_url: string | null;
    tags: string[] | null;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    employerName: string;
  }[];
  overallRating: number | null;
};

type SkillRow = {
  skills: { name: string } | { name: string }[] | null;
};

type ReviewContract = {
  employer_id: string;
  profiles: { full_name: string } | { full_name: string }[] | null;
};

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  contracts: ReviewContract | ReviewContract[] | null;
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getFreelancerPublicProfile(
  freelancerId: string,
): Promise<FreelancerPublicProfile | null> {
  const supabase = createClient();

  const [profileRes, detailsRes, skillsRes, portfolioRes, reviewsRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, avatar_url, identity_verification_status")
        .eq("id", freelancerId)
        .single(),
      supabase
        .from("freelancer_details")
        .select("headline")
        .eq("id", freelancerId)
        .single(),
      supabase
        .from("freelancer_skills")
        .select("skills(name)")
        .eq("freelancer_id", freelancerId),
      supabase
        .from("portfolio_items")
        .select("id, title, image_url, tags")
        .eq("freelancer_id", freelancerId)
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select(
          `
        id, rating, comment, created_at,
        contracts!inner (
          employer_id,
          profiles!contracts_employer_id_fkey ( full_name )
        )
      `,
        )
        .eq("reviewee_id", freelancerId)
        .order("created_at", { ascending: false }),
    ]);

  // Log every error individually instead of only checking `!profile` —
  // that's what let this fail silently as a generic "not found" last time.
  if (profileRes.error) {
    console.error("profiles fetch failed:", profileRes.error);
  }
  if (detailsRes.error) {
    console.error("freelancer_details fetch failed:", detailsRes.error);
  }
  if (skillsRes.error) {
    console.error("freelancer_skills fetch failed:", skillsRes.error);
  }
  if (portfolioRes.error) {
    console.error("portfolio_items fetch failed:", portfolioRes.error);
  }
  if (reviewsRes.error) {
    console.error("reviews fetch failed:", reviewsRes.error);
  }

  if (!profileRes.data) return null;

  const skills = ((skillsRes.data ?? []) as SkillRow[])
    .map((row) =>
      Array.isArray(row.skills) ? row.skills[0]?.name : row.skills?.name,
    )
    .filter((name): name is string => Boolean(name));

  const reviews = ((reviewsRes.data ?? []) as ReviewRow[]).map((row) => {
    const contract = firstOrSelf(row.contracts);
    const employer = firstOrSelf(contract?.profiles ?? null);
    return {
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      created_at: row.created_at,
      employerName: employer?.full_name ?? "Unknown client",
    };
  });

  const overallRating =
    reviews.length > 0 ?
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return {
    freelancerId,
    name: profileRes.data.full_name ?? "Unnamed",
    avatarUrl: profileRes.data.avatar_url ?? null,
    headline: detailsRes.data?.headline ?? "Freelancer",
    identityVerified:
      profileRes.data.identity_verification_status === "verified",
    skills,
    portfolio: portfolioRes.data ?? [],
    reviews,
    overallRating,
  };
}
