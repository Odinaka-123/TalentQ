import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeError, safeError } from "@/lib/api/sanitizeError";

const DUPLICATE_WINDOW_HOURS = 24;

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

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return safeError("Not authenticated", 401);
  }

  const body = await req.json();
  const { jobDetails, requirements, compensation } = body;

  if (!jobDetails?.title || !jobDetails?.description) {
    return safeError("Title and description are required");
  }

  // Deadline validation (pentest 5.2)
  if (compensation?.applicationDeadline) {
    const deadlineDate = new Date(compensation.applicationDeadline);
    if (Number.isNaN(deadlineDate.getTime())) {
      return safeError("Invalid application deadline");
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (deadlineDate < startOfToday) {
      return safeError("Application deadline cannot be in the past");
    }
  }

  // Duplicate validation (pentest 5.1) — scoped to this employer via RLS,
  // since `supabase` here is the authenticated server client, not admin.
  const windowStart = new Date(
    Date.now() - DUPLICATE_WINDOW_HOURS * 60 * 60 * 1000,
  ).toISOString();

  const { data: existing, error: dupError } = await supabase
    .from("jobs")
    .select("id")
    .eq("employer_id", user.id)
    .eq("title", jobDetails.title)
    .eq("description", jobDetails.description)
    .gte("created_at", windowStart)
    .limit(1);

  if (dupError) {
    return sanitizeError(dupError, "jobs/create:duplicate-check");
  }

  if (existing && existing.length > 0) {
    return safeError(
      "You've already posted a job with this title and description recently",
    );
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert({
      employer_id: user.id, // from session, never trust a client-supplied id
      title: jobDetails.title,
      description: jobDetails.description,
      job_type: mapJobType(jobDetails.jobType),
      work_arrangement: mapWorkArrangement(jobDetails.workArrangement),
      department: jobDetails.department || null,
      experience_level: requirements?.experienceLevel,
      min_budget: Number(compensation?.minBudget) || null,
      max_budget: Number(compensation?.maxBudget) || null,
      currency: compensation?.currency,
      payment_type: mapPaymentType(compensation?.paymentType),
      duration: compensation?.projectDuration || null,
      application_deadline: compensation?.applicationDeadline || null,
      status: "open",
      ai_matching_enabled: true,
    })
    .select("id")
    .single();

  if (jobError || !job) {
    return sanitizeError(jobError, "jobs/create:insert");
  }

  if (requirements?.skills?.length > 0) {
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

  return NextResponse.json({ jobId: job.id as string });
}
