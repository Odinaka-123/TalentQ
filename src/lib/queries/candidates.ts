import { createClient } from "@/lib/supabase/client";

export type PipelineStatus =
  | "Applied"
  | "Invited"
  | "Interviewing"
  | "Offer Sent"
  | "Hired";

const STATUS_TO_DB: Record<PipelineStatus, string> = {
  Applied: "applied",
  Invited: "invited",
  Interviewing: "interviewing",
  "Offer Sent": "offer_sent",
  Hired: "hired",
};

const STATUS_FROM_DB: Record<string, PipelineStatus | "Rejected"> = {
  applied: "Applied",
  invited: "Invited",
  interviewing: "Interviewing",
  offer_sent: "Offer Sent",
  hired: "Hired",
  rejected: "Rejected",
};

export type PipelineCandidate = {
  applicationId: string;
  freelancerId: string;
  name: string;
  title: string;
  avatar: string | null;
  jobTitle: string;
  aiScore: number | null;
  status: PipelineStatus;
  lastActivity: string; // ISO timestamp — see note below on formatting
};

export async function getEmployerPipeline(
  employerId: string,
): Promise<PipelineCandidate[]> {
  const supabase = createClient();

  // 1. This employer's jobs — needed to scope applications, and to label
  // each row with the job it's against.
  const { data: jobRows, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title")
    .eq("employer_id", employerId);

  if (jobsError) throw jobsError;

  const jobIds = (jobRows ?? []).map((j) => j.id);
  const jobTitleById = new Map((jobRows ?? []).map((j) => [j.id, j.title]));

  if (jobIds.length === 0) return [];

  // 2. Applications against those jobs, excluding rejected (see note above)
  const { data: appRows, error: appsError } = await supabase
    .from("applications")
    .select("id, job_id, freelancer_id, status, ai_match_score, created_at")
    .in("job_id", jobIds)
    .neq("status", "rejected")
    .order("created_at", { ascending: false });

  if (appsError) throw appsError;
  if (!appRows || appRows.length === 0) return [];

  const freelancerIds = [...new Set(appRows.map((a) => a.freelancer_id))];

  // 3. Freelancer profile + headline, fetched as flat queries rather than a
  // nested .select() join — applications has no confirmed FK constraint
  // name to hint a join against, so this avoids guessing one.
  const [
    { data: profileRows, error: profilesError },
    { data: detailRows, error: detailsError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", freelancerIds),
    supabase
      .from("freelancer_details")
      .select("id, headline")
      .in("id", freelancerIds),
  ]);

  if (profilesError) throw profilesError;
  if (detailsError) throw detailsError;

  const profileById = new Map((profileRows ?? []).map((p) => [p.id, p]));
  const headlineById = new Map(
    (detailRows ?? []).map((d) => [d.id, d.headline as string | null]),
  );

  return appRows.map((row): PipelineCandidate => {
    const profile = profileById.get(row.freelancer_id);

    return {
      applicationId: row.id,
      freelancerId: row.freelancer_id,
      name: profile?.full_name ?? "Unnamed",
      title: headlineById.get(row.freelancer_id) ?? "Freelancer",
      avatar: profile?.avatar_url ?? null,
      jobTitle: jobTitleById.get(row.job_id) ?? "Untitled role",
      aiScore: row.ai_match_score,
      status: (STATUS_FROM_DB[row.status] as PipelineStatus) ?? "Applied",
      lastActivity: row.created_at,
    };
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  status: PipelineStatus,
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("applications")
    .update({ status: STATUS_TO_DB[status] })
    .eq("id", applicationId);

  if (error) throw error;
}
