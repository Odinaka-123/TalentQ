import { createClient } from "@/lib/supabase/client";

export type JobDetail = {
  id: string;
  title: string;
  description: string;
  client: string;
  location: string;
  jobType: string;
  paymentType: string;
  minBudget: number | null;
  maxBudget: number | null;
  duration: string;
  applicationDeadline: string | null;
  status: string;
  proposals: number;
  tags: string[];
  alreadyApplied: boolean;
};

type JobSkillRow = {
  skill_id: string;
  skills: { name: string } | { name: string }[] | null;
};

function formatEnumLabel(value: string | null): string {
  if (!value) return "Not specified";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getJobById(
  jobId: string,
  freelancerId: string,
): Promise<JobDetail | null> {
  const supabase = createClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      `
      id, title, description, job_type, work_arrangement, payment_type,
      min_budget, max_budget, currency, duration, application_deadline, status,
      profiles!jobs_employer_id_fkey ( full_name, employer_details ( company_name, country ) ),
      job_skills ( skill_id, skills ( name ) ),
      applications ( id, freelancer_id )
    `,
    )
    .eq("id", jobId)
    .single();

  if (error || !job) {
    console.error("getJobById failed:", error);
    return null;
  }

  const employerProfile =
    Array.isArray(job.profiles) ? job.profiles[0] : job.profiles;
  const employerDetails =
    Array.isArray(employerProfile?.employer_details) ?
      employerProfile.employer_details[0]
    : employerProfile?.employer_details;

  const jobSkillRows: JobSkillRow[] = job.job_skills ?? [];
  const tags = jobSkillRows
    .map((js) =>
      Array.isArray(js.skills) ? js.skills[0]?.name : js.skills?.name,
    )
    .filter((name): name is string => Boolean(name));

  const applications = job.applications ?? [];
  const alreadyApplied = applications.some(
    (a) => a.freelancer_id === freelancerId,
  );

  return {
    id: job.id,
    title: job.title,
    description: job.description ?? "No description provided.",
    client:
      employerDetails?.company_name ?? employerProfile?.full_name ?? "Employer",
    location:
      job.work_arrangement === "remote" ?
        "Remote - Worldwide"
      : (employerDetails?.country ?? "Location not set"),
    jobType: formatEnumLabel(job.job_type),
    paymentType: formatEnumLabel(job.payment_type),
    minBudget: job.min_budget,
    maxBudget: job.max_budget,
    duration: job.duration ?? "Not specified",
    applicationDeadline: job.application_deadline,
    status: job.status,
    proposals: applications.length,
    tags,
    alreadyApplied,
  };
}

export async function applyToJob(
  jobId: string,
  _freelancerId: string,
): Promise<{ error: string | null; alreadyApplied?: boolean }> {
  const res = await fetch("/api/applications/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { error: data.error ?? "Could not submit your application. Try again." };
  }

  if (data.alreadyApplied) {
    return { error: null, alreadyApplied: true };
  }

  return { error: null };
}
