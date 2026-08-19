import { createClient } from "@/lib/supabase/client";
import type {
  Job,
  JobLevel,
} from "@/app/(freelancer)/components/JobCard";

type JobSkillRow = {
  skill_id: string;
  skills: { name: string } | { name: string }[] | null;
};

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

export type FindJobsResult = Job & { firstGig?: boolean };

export async function getJobsForFreelancer(
  freelancerId: string,
): Promise<FindJobsResult[]> {
  const supabase = createClient();

  const { data: freelancerSkillRows } = await supabase
    .from("freelancer_skills")
    .select("skill_id")
    .eq("freelancer_id", freelancerId);

  const freelancerSkillIds = new Set(
    (freelancerSkillRows ?? []).map((r) => r.skill_id),
  );

  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      `
      id, title, min_budget, max_budget, currency, duration,
      experience_level, work_arrangement, created_at,
      profiles!jobs_employer_id_fkey ( full_name ),
      employer_details!jobs_employer_id_fkey ( company_name, country ),
      job_skills ( skill_id, skills ( name ) ),
      applications ( id )
    `,
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (!jobs) return [];

  return jobs.map((job): FindJobsResult => {
    const employerDetails =
      Array.isArray(job.employer_details) ?
        job.employer_details[0]
      : job.employer_details;
    const employerProfile =
      Array.isArray(job.profiles) ? job.profiles[0] : job.profiles;

    const jobSkillRows = (job.job_skills ?? []) as JobSkillRow[];

    const tags = jobSkillRows
      .map((js) =>
        Array.isArray(js.skills) ? js.skills[0]?.name : js.skills?.name,
      )
      .filter((name): name is string => Boolean(name));

    const jobSkillIds = jobSkillRows.map((js) => js.skill_id);
    const overlapCount = jobSkillIds.filter((id) =>
      freelancerSkillIds.has(id),
    ).length;
    const matchScore =
      jobSkillIds.length > 0 ?
        Math.round((overlapCount / jobSkillIds.length) * 100)
      : 0;

    const badges: string[] = [];
    badges.push(matchScore >= 80 ? "Top Applicant" : `${matchScore}% Match`);
    if (job.experience_level?.toLowerCase().includes("senior")) {
      badges.push("Senior Preferred");
    }

    const isEntryLevel = job.experience_level?.toLowerCase().includes("entry");
    const proposalCount =
      Array.isArray(job.applications) ? job.applications.length : 0;

    return {
      id: job.id,
      title: job.title,
      badges,
      client:
        employerDetails?.company_name ??
        employerProfile?.full_name ??
        "Employer",
      location:
        job.work_arrangement === "remote" ?
          "Remote - Worldwide"
        : (employerDetails?.country ?? "Location not set"),
      postedAgo: formatTimeAgo(job.created_at),
      proposals: proposalCount,
      tags,
      priceRange:
        job.min_budget && job.max_budget ?
          `$${job.min_budget}-${job.max_budget}`
        : "Budget not set",
      duration: job.duration ?? "Not specified",
      level: mapExperienceLevel(job.experience_level),
      firstGig: isEntryLevel && proposalCount < 5,
    };
  });
}
