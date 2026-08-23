import { createClient } from "@/lib/supabase/client";
import type { PipelineStatus } from "./candidates";

export type CandidateDetail = {
  applicationId: string;
  freelancerId: string;
  jobId: string;
  status: PipelineStatus | "Rejected";
  aiScore: number | null;
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

const STATUS_FROM_DB: Record<string, PipelineStatus | "Rejected"> = {
  applied: "Applied",
  invited: "Invited",
  interviewing: "Interviewing",
  offer_sent: "Offer Sent",
  hired: "Hired",
  rejected: "Rejected",
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

export async function getCandidateDetail(
  applicationId: string,
): Promise<CandidateDetail | null> {
  const supabase = createClient();

  const { data: application, error: appError } = await supabase
    .from("applications")
    .select("id, job_id, freelancer_id, status, ai_match_score")
    .eq("id", applicationId)
    .single();

  if (appError || !application) return null;

  const freelancerId = application.freelancer_id;

  const [
    { data: profile },
    { data: details },
    { data: skillRows },
    { data: portfolio },
    { data: reviewRows },
  ] = await Promise.all([
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

  const skills = ((skillRows ?? []) as SkillRow[])
    .map((row) =>
      Array.isArray(row.skills) ? row.skills[0]?.name : row.skills?.name,
    )
    .filter((name): name is string => Boolean(name));

  const reviews = ((reviewRows ?? []) as ReviewRow[]).map((row) => {
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
    applicationId: application.id,
    freelancerId,
    jobId: application.job_id,
    status: STATUS_FROM_DB[application.status] ?? "Applied",
    aiScore: application.ai_match_score,
    name: profile?.full_name ?? "Unnamed",
    avatarUrl: profile?.avatar_url ?? null,
    headline: details?.headline ?? "Freelancer",
    identityVerified: profile?.identity_verification_status === "verified",
    skills,
    portfolio: portfolio ?? [],
    reviews,
    overallRating,
  };
}
