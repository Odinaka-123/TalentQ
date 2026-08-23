import { createClient } from "@/lib/supabase/client";

type JobDetailsData = {
  title: string;
  jobType: string;
  workArrangement: string;
  department: string;
  description: string;
};

type RequirementsData = {
  experienceLevel: string;
  yearsOfExperience: string;
  skills: string[];
  preferredQualifications: string;
};

type CompensationData = {
  currency: string;
  minBudget: string;
  maxBudget: string;
  experienceLevel: string;
  projectDuration: string;
  paymentType: string;
  applicationDeadline: string;
};

function mapJobType(label: string): string {
  const map: Record<string, string> = {
    "Full-time": "full_time",
    "Part-time": "part_time",
    Contract: "contract",
    Freelance: "freelance",
  };
  return map[label] ?? "full_time";
}

function mapWorkArrangement(label: string): string {
  const map: Record<string, string> = {
    Remote: "remote",
    Hybrid: "hybrid",
    "On-site": "onsite",
  };
  return map[label] ?? "remote";
}

function mapPaymentType(label: string): string {
  const map: Record<string, string> = {
    "Fixed price": "fixed",
    "Hourly rate": "hourly",
    "Milestone-based": "milestone",
  };
  return map[label] ?? "fixed";
}

export async function createJob(
  employerId: string,
  jobDetails: JobDetailsData,
  requirements: RequirementsData,
  compensation: CompensationData,
) {
  const supabase = createClient();

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert({
      employer_id: employerId,
      title: jobDetails.title,
      description: jobDetails.description,
      job_type: mapJobType(jobDetails.jobType),
      work_arrangement: mapWorkArrangement(jobDetails.workArrangement),
      department: jobDetails.department || null,
      experience_level: requirements.experienceLevel,
      min_budget: Number(compensation.minBudget) || null,
      max_budget: Number(compensation.maxBudget) || null,
      currency: compensation.currency,
      payment_type: mapPaymentType(compensation.paymentType),
      duration: compensation.projectDuration || null,
      application_deadline: compensation.applicationDeadline || null,
      status: "open",
      ai_matching_enabled: true,
    })
    .select("id")
    .single();

  if (jobError || !job) {
    return { error: jobError?.message ?? "Failed to create job", jobId: null };
  }

  if (requirements.skills.length > 0) {
    const { data: skillRows } = await supabase
      .from("skills")
      .select("id, name")
      .in("name", requirements.skills);

    if (skillRows && skillRows.length > 0) {
      const jobSkillRows = skillRows.map((s) => ({
        job_id: job.id,
        skill_id: s.id,
      }));
      await supabase.from("job_skills").insert(jobSkillRows);
    }
  }

  return { error: null, jobId: job.id as string };
}
