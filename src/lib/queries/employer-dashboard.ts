import { createClient } from "@/lib/supabase/client";

export type EmployerDashboardData = {
  stats: {
    activeJobs: number;
    spendThisMonth: number;
    applicationsReceived: number;
    profileViews: number; // TODO: always 0 until profile_views schema confirmed
  };
  verificationStatus: string | null;
  activeContracts: {
    id: string;
    title: string;
    freelancerName: string;
    amount: number;
    progress: number;
  }[];
  recommended: {
    applicationId: string;
    freelancerName: string;
    jobTitle: string;
    matchScore: number | null;
  }[];
};

type MilestoneRow = {
  contract_id: string;
  amount: number;
  status: string;
  released_at: string | null;
};

type ContractJob = { title: string };
type ContractFreelancerProfile = { full_name: string };

type ContractRow = {
  id: string;
  job_id: string;
  freelancer_id: string;
  status: string;
  jobs: ContractJob | ContractJob[] | null;
  profiles: ContractFreelancerProfile | ContractFreelancerProfile[] | null;
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getEmployerDashboard(
  employerId: string,
): Promise<EmployerDashboardData> {
  const supabase = createClient();

  const [{ data: profile }, { data: jobRows }, { data: contractRowsRaw }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("identity_verification_status")
        .eq("id", employerId)
        .single(),
      supabase
        .from("jobs")
        .select("id, title, status")
        .eq("employer_id", employerId),
      supabase
        .from("contracts")
        .select(
          "id, job_id, freelancer_id, status, jobs(title), profiles!contracts_freelancer_id_fkey(full_name)",
        )
        .eq("employer_id", employerId),
    ]);

  const contractRows = (contractRowsRaw ?? []) as ContractRow[];

  const allJobIds = (jobRows ?? []).map((j) => j.id);
  const openJobIds = (jobRows ?? [])
    .filter((j) => j.status === "open")
    .map((j) => j.id);
  const activeJobs = openJobIds.length;

  const contractIds = contractRows.map((c) => c.id);

  // Applications received across all this employer's jobs
  let applicationsReceived = 0;
  if (allJobIds.length > 0) {
    const { count } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .in("job_id", allJobIds);
    applicationsReceived = count ?? 0;
  }

  // Milestones across all this employer's contracts, for spend + progress
  let milestoneRows: MilestoneRow[] = [];

  if (contractIds.length > 0) {
    const { data } = await supabase
      .from("milestones")
      .select("contract_id, amount, status, released_at")
      .in("contract_id", contractIds);
    milestoneRows = (data ?? []) as MilestoneRow[];
  }

  const now = new Date();
  const spendThisMonth = milestoneRows
    .filter((m) => {
      if (m.status !== "released" || !m.released_at) return false;
      const releasedDate = new Date(m.released_at);
      return (
        releasedDate.getFullYear() === now.getFullYear() &&
        releasedDate.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const milestonesByContract = new Map<
    string,
    { total: number; released: number }
  >();
  milestoneRows.forEach((m) => {
    const existing = milestonesByContract.get(m.contract_id) ?? {
      total: 0,
      released: 0,
    };
    existing.total += 1;
    if (m.status === "released") existing.released += 1;
    milestonesByContract.set(m.contract_id, existing);
  });

  const activeContracts = contractRows
    .filter((c) => c.status !== "completed" && c.status !== "cancelled")
    .map((c) => {
      const job = firstOrSelf(c.jobs);
      const freelancer = firstOrSelf(c.profiles);
      const progressInfo = milestonesByContract.get(c.id);
      const progress =
        progressInfo && progressInfo.total > 0 ?
          Math.round((progressInfo.released / progressInfo.total) * 100)
        : 0;
      const amount = milestoneRows
        .filter((m) => m.contract_id === c.id)
        .reduce((sum, m) => sum + Number(m.amount), 0);

      return {
        id: c.id,
        title: job?.title ?? "Untitled role",
        freelancerName: freelancer?.full_name ?? "Unknown freelancer",
        amount,
        progress,
      };
    });

  // Recommended: top applications by ai_match_score across open jobs
  let recommended: EmployerDashboardData["recommended"] = [];
  if (openJobIds.length > 0) {
    const { data: appRows } = await supabase
      .from("applications")
      .select("id, job_id, freelancer_id, ai_match_score")
      .in("job_id", openJobIds)
      .eq("status", "applied")
      .order("ai_match_score", { ascending: false, nullsFirst: false })
      .limit(3);

    if (appRows && appRows.length > 0) {
      const freelancerIds = appRows.map((a) => a.freelancer_id);
      const { data: freelancerProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", freelancerIds);

      const nameById = new Map(
        (freelancerProfiles ?? []).map((p) => [p.id, p.full_name]),
      );
      const jobTitleById = new Map((jobRows ?? []).map((j) => [j.id, j.title]));

      recommended = appRows.map((a) => ({
        applicationId: a.id,
        freelancerName: nameById.get(a.freelancer_id) ?? "Unnamed",
        jobTitle: jobTitleById.get(a.job_id) ?? "Untitled role",
        matchScore: a.ai_match_score,
      }));
    }
  }

  return {
    stats: {
      activeJobs,
      spendThisMonth,
      applicationsReceived,
      profileViews: 0, // TODO
    },
    verificationStatus: profile?.identity_verification_status ?? null,
    activeContracts,
    recommended,
  };
}
