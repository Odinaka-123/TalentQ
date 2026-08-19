import { createClient } from "@/lib/supabase/client";

const TEAM_ACCOUNT_ID = "3cfc12ac-7143-4296-9c96-957edd360cc3";

export type ScoreBreakdown = {
  identity: number;
  skills: number;
  portfolio: number;
  activity: number;
  reviews: number;
};

export type SkillDemand = {
  skill: string;
  demand: number; // % of open jobs requiring this skill
};

export type RateComparison = {
  category: string | null;
  yourRate: number | null;
  avgVerified: number | null;
  avgUnverified: number | null;
};

export type TopAction = {
  label: string;
  meta: string;
  impactPoints: number;
};

export type FreelancerAnalytics = {
  stats: {
    profileScore: number;
    proposalRate: number;
    avgResponseHours: number | null;
    clientReturnRate: number;
  };
  breakdown: ScoreBreakdown;
  tier: {
    label: string;
    badge: "low" | "moderate" | "strong" | "elite";
    pointsToNextTier: number;
  };
  skillsGap: SkillDemand[];
  rateVsMarket: RateComparison;
  topActions: TopAction[];
  aiInsight: string;
};

function scoreTier(score: number) {
  if (score >= 90)
    return { label: "Elite", badge: "elite" as const, next: 100 };
  if (score >= 70)
    return { label: "Good Standing", badge: "strong" as const, next: 90 };
  if (score >= 40)
    return { label: "Building Trust", badge: "moderate" as const, next: 70 };
  return { label: "Getting Started", badge: "low" as const, next: 40 };
}

async function getAvgResponseHours(
  supabase: ReturnType<typeof createClient>,
  freelancerId: string,
): Promise<number | null> {
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `participant_one.eq.${freelancerId},participant_two.eq.${freelancerId}`,
    );

  const conversationIds = (conversations ?? []).map((c) => c.id);
  if (conversationIds.length === 0) return null;

  const { data: messages } = await supabase
    .from("messages")
    .select("conversation_id, sender_id, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: true });

  const byConversation = new Map<
    string,
    { sender_id: string; created_at: string }[]
  >();

  for (const m of messages ?? []) {
    if (m.sender_id === TEAM_ACCOUNT_ID) continue;
    const arr = byConversation.get(m.conversation_id) ?? [];
    arr.push(m);
    byConversation.set(m.conversation_id, arr);
  }

  const diffsHours: number[] = [];

  for (const msgs of byConversation.values()) {
    const firstFromOther = msgs.find((m) => m.sender_id !== freelancerId);
    if (!firstFromOther) continue;

    const firstReply = msgs.find(
      (m) =>
        m.sender_id === freelancerId &&
        new Date(m.created_at) > new Date(firstFromOther.created_at),
    );
    if (!firstReply) continue;

    const diffMs =
      new Date(firstReply.created_at).getTime() -
      new Date(firstFromOther.created_at).getTime();
    diffsHours.push(diffMs / (1000 * 60 * 60));
  }

  if (diffsHours.length === 0) return null;
  return diffsHours.reduce((a, b) => a + b, 0) / diffsHours.length;
}

export async function getFreelancerAnalytics(
  freelancerId: string,
): Promise<FreelancerAnalytics> {
  const supabase = createClient();

  const [
    profileRes,
    detailsRes,
    freelancerSkillsRes,
    portfolioRes,
    reviewsRes,
    applicationsRes,
    contractsRes,
    activityRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("identity_verification_status")
      .eq("id", freelancerId)
      .single(),
    supabase
      .from("freelancer_details")
      .select("hourly_rate")
      .eq("id", freelancerId)
      .single(),
    supabase
      .from("freelancer_skills")
      .select("skill_id, skills ( name, category )")
      .eq("freelancer_id", freelancerId),
    supabase
      .from("portfolio_items")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", freelancerId),
    supabase.from("reviews").select("rating").eq("reviewee_id", freelancerId),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", freelancerId),
    supabase
      .from("contracts")
      .select("id, employer_id, status")
      .eq("freelancer_id", freelancerId),
    supabase
      .from("activity_log")
      .select("id, created_at")
      .eq("user_id", freelancerId)
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      ),
  ]);

  // ---------- Breakdown metrics (0-100 each) ----------
  const identity =
    profileRes.data?.identity_verification_status === "verified" ? 100
    : profileRes.data?.identity_verification_status === "pending" ? 50
    : 0;

  const skillRows = freelancerSkillsRes.data ?? [];
  const skillsScore = Math.min(100, skillRows.length * 20);

  const portfolioCount = portfolioRes.count ?? 0;
  const portfolioScore = Math.min(100, portfolioCount * 34);

  const reviews = reviewsRes.data ?? [];
  const reviewsScore = Math.min(100, reviews.length * 20);

  const activityCount = activityRes.data?.length ?? 0;
  const activityScore = Math.min(100, activityCount * 20);

  const breakdown: ScoreBreakdown = {
    identity,
    skills: skillsScore,
    portfolio: portfolioScore,
    activity: activityScore,
    reviews: reviewsScore,
  };

  const profileScore = Math.round(
    (identity + skillsScore + portfolioScore + activityScore + reviewsScore) /
      5,
  );

  const tierInfo = scoreTier(profileScore);

  // ---------- Proposal rate & client return rate ----------
  const applicationsCount = applicationsRes.count ?? 0;
  const contracts = contractsRes.data ?? [];
  const wonContracts = contracts.filter((c) =>
    ["active", "completed"].includes(c.status),
  );
  const proposalRate =
    applicationsCount > 0 ?
      Math.round((wonContracts.length / applicationsCount) * 100)
    : 0;

  const employerCounts = new Map<string, number>();
  for (const c of contracts) {
    employerCounts.set(
      c.employer_id,
      (employerCounts.get(c.employer_id) ?? 0) + 1,
    );
  }
  const totalEmployers = employerCounts.size;
  const returningEmployers = Array.from(employerCounts.values()).filter(
    (n) => n >= 2,
  ).length;
  const clientReturnRate =
    totalEmployers > 0 ?
      Math.round((returningEmployers / totalEmployers) * 100)
    : 0;

  // ---------- Avg response time ----------
  const avgResponseHours = await getAvgResponseHours(supabase, freelancerId);

  // ---------- Skills gap (market demand) ----------
  const { data: demandRows } = await supabase
    .from("job_skills")
    .select("skill_id, skills ( name ), jobs!inner ( status )")
    .eq("jobs.status", "open");

  const { count: openJobsCount } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("status", "open");

  const demandCounts = new Map<string, { name: string; count: number }>();
  for (const row of demandRows ?? []) {
    const skill = Array.isArray(row.skills) ? row.skills[0] : row.skills;
    if (!skill) continue;
    const existing = demandCounts.get(row.skill_id);
    if (existing) {
      existing.count += 1;
    } else {
      demandCounts.set(row.skill_id, { name: skill.name, count: 1 });
    }
  }

  const totalOpenJobs = openJobsCount ?? 0;
  const skillsGap: SkillDemand[] = Array.from(demandCounts.values())
    .map((d) => ({
      skill: d.name,
      demand:
        totalOpenJobs > 0 ? Math.round((d.count / totalOpenJobs) * 100) : 0,
    }))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 5);

  // ---------- Rate vs market ----------
  const categoryCounts = new Map<string, number>();
  for (const row of skillRows) {
    const skill = Array.isArray(row.skills) ? row.skills[0] : row.skills;
    const category = skill?.category;
    if (!category) continue;
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }
  const topCategory =
    Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    null;

  let rateVsMarket: RateComparison = {
    category: topCategory,
    yourRate: detailsRes.data?.hourly_rate ?? null,
    avgVerified: null,
    avgUnverified: null,
  };

  if (topCategory) {
    const { data: categorySkillIds } = await supabase
      .from("skills")
      .select("id")
      .eq("category", topCategory);

    const skillIds = (categorySkillIds ?? []).map((s) => s.id);

    if (skillIds.length > 0) {
      const { data: peerFreelancerIds } = await supabase
        .from("freelancer_skills")
        .select("freelancer_id")
        .in("skill_id", skillIds);

      const peerIds = Array.from(
        new Set((peerFreelancerIds ?? []).map((r) => r.freelancer_id)),
      ).filter((id) => id !== freelancerId);

      if (peerIds.length > 0) {
        const { data: peerDetails } = await supabase
          .from("freelancer_details")
          .select("id, hourly_rate")
          .in("id", peerIds);

        const { data: peerProfiles } = await supabase
          .from("profiles")
          .select("id, identity_verification_status")
          .in("id", peerIds);

        const verificationMap = new Map(
          (peerProfiles ?? []).map((p) => [
            p.id,
            p.identity_verification_status,
          ]),
        );

        const verifiedRates: number[] = [];
        const unverifiedRates: number[] = [];

        for (const d of peerDetails ?? []) {
          if (d.hourly_rate == null) continue;
          const isVerified = verificationMap.get(d.id) === "verified";
          (isVerified ? verifiedRates : unverifiedRates).push(
            Number(d.hourly_rate),
          );
        }

        const avg = (arr: number[]) =>
          arr.length > 0 ?
            Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
          : null;

        rateVsMarket = {
          category: topCategory,
          yourRate: detailsRes.data?.hourly_rate ?? null,
          avgVerified: avg(verifiedRates),
          avgUnverified: avg(unverifiedRates),
        };
      }
    }
  }

  // ---------- Top actions (rule-based, ranked by score impact) ----------
  const candidateActions: TopAction[] = [];

  if (identity < 100) {
    candidateActions.push({
      label:
        identity === 0 ?
          "Complete identity verification"
        : "Finish pending verification review",
      meta: "Trust",
      impactPoints: Math.round((100 - identity) * 0.2),
    });
  }
  if (portfolioScore < 100) {
    const needed = Math.ceil((100 - portfolioScore) / 34);
    candidateActions.push({
      label: `Add ${needed} more portfolio case ${needed === 1 ? "study" : "studies"}`,
      meta: "Profile",
      impactPoints: Math.round((100 - portfolioScore) * 0.2),
    });
  }
  if (skillsScore < 100) {
    candidateActions.push({
      label: "Add more skills to your profile",
      meta: "Skills",
      impactPoints: Math.round((100 - skillsScore) * 0.2),
    });
  }
  if (reviewsScore < 100) {
    candidateActions.push({
      label:
        reviews.length === 0 ?
          "Earn your first client review"
        : "Earn more client reviews",
      meta: "Trust",
      impactPoints: Math.round((100 - reviewsScore) * 0.2),
    });
  }
  if (activityScore < 100) {
    candidateActions.push({
      label: "Stay active — respond to messages and applications regularly",
      meta: "Activity",
      impactPoints: Math.round((100 - activityScore) * 0.2),
    });
  }

  const topActions = candidateActions
    .sort((a, b) => b.impactPoints - a.impactPoints)
    .slice(0, 4);

  // ---------- AI insight (rule-based) ----------
  const weakest = [
    { key: "portfolio", value: portfolioScore },
    { key: "skills", value: skillsScore },
    { key: "reviews", value: reviewsScore },
    { key: "identity", value: identity },
    { key: "activity", value: activityScore },
  ].sort((a, b) => a.value - b.value)[0];

  const topDemandSkill = skillsGap[0]?.skill;

  let aiInsight =
    "Keep your profile active and up to date to stay visible to employers.";

  if (weakest.key === "portfolio") {
    aiInsight =
      "Freelancers who add 2+ portfolio case studies see a noticeable increase in proposal acceptance. Consider adding a few examples of your recent work.";
  } else if (weakest.key === "skills") {
    aiInsight =
      topDemandSkill ?
        `${topDemandSkill} is currently one of the most requested skills in open jobs. Adding it to your profile could put you in front of more employers.`
      : "Adding more skills to your profile helps you match with more open jobs.";
  } else if (weakest.key === "reviews") {
    aiInsight =
      "Completing a contract and earning your first client review builds trust with future employers and improves your visibility.";
  } else if (weakest.key === "identity") {
    aiInsight =
      "Verified freelancers are shown higher in search results. Completing identity verification can meaningfully boost your visibility.";
  } else if (weakest.key === "activity") {
    aiInsight =
      "Staying active — replying to messages and submitting proposals regularly — correlates with higher proposal acceptance rates.";
  }

  return {
    stats: {
      profileScore,
      proposalRate,
      avgResponseHours,
      clientReturnRate,
    },
    breakdown,
    tier: {
      label: tierInfo.label,
      badge: tierInfo.badge,
      pointsToNextTier: Math.max(0, tierInfo.next - profileScore),
    },
    skillsGap,
    rateVsMarket,
    topActions,
    aiInsight,
  };
}
