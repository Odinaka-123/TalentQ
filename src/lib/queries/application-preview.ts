import { createClient } from "@/lib/supabase/client";

export type ApplicationPreview = {
  applicationId: string;
  jobTitle: string;
  freelancerName: string;
};

export async function getApplicationPreview(
  applicationId: string,
): Promise<ApplicationPreview | null> {
  const supabase = createClient();

  const { data } = await supabase
    .from("applications")
    .select(
      "id, jobs ( title ), profiles!applications_freelancer_id_fkey ( full_name )",
    )
    .eq("id", applicationId)
    .single();

  if (!data) return null;

  const job = Array.isArray(data.jobs) ? data.jobs[0] : data.jobs;
  const freelancer =
    Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;

  return {
    applicationId: data.id,
    jobTitle: job?.title ?? "Untitled Job",
    freelancerName: freelancer?.full_name ?? "Freelancer",
  };
}
