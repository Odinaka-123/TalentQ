import { createClient } from "@/lib/supabase/client";

export async function getFreelancerDashboard(userId: string) {
  const supabase = createClient();

  const [
    activeContractsRes,
    proposalsRes,
    contractsWithMilestonesRes,
    profileViewsRes,
    activityRes,
    profileRes,
    freelancerSkillsRes,
  ] = await Promise.all([
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", userId)
      .eq("status", "active"),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", userId),
    supabase
      .from("contracts")
      .select(
        `
        id,
        jobs ( title ),
        profiles!contracts_employer_id_fkey ( full_name ),
        milestones ( id, amount, status )
      `
      )
      .eq("freelancer_id", userId)
      .eq("status", "active"),
    supabase
      .from("profile_views")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", userId),
    supabase
      .from("activity_log")
      .select("id, message, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("identity_verification_status")
      .eq("id", userId)
      .single(),
    supabase
      .from("freelancer_skills")
      .select("skill_id")
      .eq("freelancer_id", userId),
  ]);

  // Pending payments = sum of milestone amounts not yet released, across all active contracts
  const contracts = contractsWithMilestonesRes.data ?? [];
  const pendingPayments = contracts.reduce((sum, contract) => {
    const milestones = Array.isArray(contract.milestones) ? contract.milestones : [];
    const contractPending = milestones
      .filter((m) => m.status === "pending" || m.status === "delivered")
      .reduce((s, m) => s + Number(m.amount), 0);
    return sum + contractPending;
  }, 0);

  const activeContracts = contracts.map((contract) => {
    const milestones = Array.isArray(contract.milestones) ? contract.milestones : [];
    const totalAmount = milestones.reduce((s, m) => s + Number(m.amount), 0);
    const releasedCount = milestones.filter((m) => m.status === "released").length;
    const progress = milestones.length > 0
      ? Math.round((releasedCount / milestones.length) * 100)
      : 0;

    const job = Array.isArray(contract.jobs) ? contract.jobs[0] : contract.jobs;
    const employer = Array.isArray(contract.profiles)
      ? contract.profiles[0]
      : contract.profiles;

    return {
      id: contract.id,
      title: job?.title ?? "Untitled Contract",
      client: employer?.full_name ?? "Client",
      amount: totalAmount,
      progress,
    };
  });

  // Recommended jobs — matches freelancer's skills, excludes jobs already applied to
  const skillIds = (freelancerSkillsRes.data ?? []).map((r) => r.skill_id);

  let recommended: { id: string; title: string; minBudget: number | null; maxBudget: number | null; matchScore: number }[] = [];

  if (skillIds.length > 0) {
    const { data: matchingJobs } = await supabase
      .from("job_skills")
      .select("job_id, jobs!inner ( id, title, min_budget, max_budget, status )")
      .in("skill_id", skillIds)
      .eq("jobs.status", "open");

    const { data: existingApplications } = await supabase
      .from("applications")
      .select("job_id")
      .eq("freelancer_id", userId);

    const appliedJobIds = new Set((existingApplications ?? []).map((a) => a.job_id));

    const jobMatchCounts = new Map<string, { job: any; count: number }>();
    for (const row of matchingJobs ?? []) {
      const job = Array.isArray(row.jobs) ? row.jobs[0] : row.jobs;
      if (!job || appliedJobIds.has(job.id)) continue;
      const existing = jobMatchCounts.get(job.id);
      if (existing) {
        existing.count += 1;
      } else {
        jobMatchCounts.set(job.id, { job, count: 1 });
      }
    }

    recommended = Array.from(jobMatchCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(({ job, count }) => ({
        id: job.id,
        title: job.title,
        minBudget: job.min_budget,
        maxBudget: job.max_budget,
        matchScore: Math.min(99, 60 + count * 10), // rough placeholder scoring
      }));
  }

  return {
    stats: {
      activeContracts: activeContractsRes.count ?? 0,
      pendingPayments,
      proposalsSent: proposalsRes.count ?? 0,
      profileViews: profileViewsRes.count ?? 0,
    },
    activeContracts,
    recommended,
    activity: (activityRes.data ?? []).map((a) => a.message),
    verificationStatus: profileRes.data?.identity_verification_status ?? "unverified",
  };
}