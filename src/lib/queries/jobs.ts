import { createClient } from "@/lib/supabase/client";
import type {
  Job,
  JobLevel,
} from "@/app/(freelancer)/components/JobCard";

function mapExperienceLevel(level: string | null): JobLevel {
  if (!level) return "Intermediate";
  const normalized = level.toLowerCase();
  if (normalized.includes("entry")) return "Beginner";
  if (normalized.includes("senior") || normalized.includes("lead"))
    return "Expert";
  return "Intermediate";
}

function formatTimeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export async function getOpenJobs(): Promise<Job[]> {
  const supabase = createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      `
      id, title, min_budget, max_budget, currency, duration,
      experience_level, work_arrangement, created_at,
      profiles!jobs_employer_id_fkey ( full_name ),
      employer_details!jobs_employer_id_fkey ( company_name, country ),
      job_skills ( skills ( name ) ),
      applications ( id )
    `,
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (!jobs) return [];

  return jobs.map((job): Job => {
    const employerDetails =
      Array.isArray(job.employer_details) ?
        job.employer_details[0]
      : job.employer_details;
    const employerProfile =
      Array.isArray(job.profiles) ? job.profiles[0] : job.profiles;

    const tags = (job.job_skills ?? [])
      .map((js: any) =>
        Array.isArray(js.skills) ? js.skills[0]?.name : js.skills?.name,
      )
      .filter(Boolean);

    const proposalCount =
      Array.isArray(job.applications) ? job.applications.length : 0;

    return {
      id: job.id,
      title: job.title,
      badges: ["AI Match", "Escrow Protected"], // static for now — see note below
      client:
        employerDetails?.company_name ??
        employerProfile?.full_name ??
        "Employer",
      location:
        job.work_arrangement === "remote" ?
          "Remote"
        : (employerDetails?.country ?? "Location not set"),
      postedAgo: formatTimeAgo(job.created_at),
      proposals: proposalCount,
      tags,
      priceRange:
        job.min_budget && job.max_budget ?
          `$${job.min_budget}-$${job.max_budget}`
        : "Budget not set",
      duration: job.duration ?? "Not specified",
      level: mapExperienceLevel(job.experience_level),
    };
  });
}

export async function applyToJob(jobId: string, proposalNote: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("applications").insert({
    job_id: jobId,
    freelancer_id: user.id,
    proposal_note: proposalNote,
    status: "applied",
  });

  return { error };
}
