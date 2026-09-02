import { createClient } from "@/lib/supabase/client";

export type UnfundedMilestone = {
  id: string;
  title: string;
  amount: number;
  freelancerName: string;
  jobTitle: string;
};

type MilestoneRow = {
  id: string;
  title: string;
  amount: number;
  contracts:
    | {
        job_id: string;
        profiles: { full_name: string } | { full_name: string }[] | null;
        jobs: { title: string } | { title: string }[] | null;
      }
    | {
        job_id: string;
        profiles: { full_name: string } | { full_name: string }[] | null;
        jobs: { title: string } | { title: string }[] | null;
      }[]
    | null;
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getUnfundedMilestones(
  employerId: string,
): Promise<UnfundedMilestone[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("milestones")
    .select(
      `
      id, title, amount,
      contracts!inner (
        job_id, employer_id,
        profiles!contracts_freelancer_id_fkey ( full_name ),
        jobs ( title )
      )
    `,
    )
    .eq("status", "upcoming")
    .eq("contracts.employer_id", employerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as MilestoneRow[]).map((m) => {
    const contract = firstOrSelf(m.contracts);
    return {
      id: m.id,
      title: m.title,
      amount: Number(m.amount),
      freelancerName: firstOrSelf(contract?.profiles)?.full_name ?? "Unknown",
      jobTitle: firstOrSelf(contract?.jobs)?.title ?? "Untitled job",
    };
  });
}
