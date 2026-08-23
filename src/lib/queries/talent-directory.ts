import { createClient } from "@/lib/supabase/client";

export type TalentListing = {
  freelancerId: string;
  name: string;
  avatarUrl: string | null;
  headline: string;
  skills: string[];
  proposalCount: number;
  // TODO: location, availability, rate, level, status — all pending
  // freelancer_details' full column list.
};

type SkillRow = {
  freelancer_id: string;
  skills: { name: string } | { name: string }[] | null;
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getAvailableTalent(): Promise<TalentListing[]> {
  const supabase = createClient();

  // Inner join via freelancer_details naturally scopes this to freelancers
  // only — no separate role/account_type column needed.
  const { data: detailRows, error: detailsError } = await supabase
    .from("freelancer_details")
    .select("id, headline");

  if (detailsError) throw detailsError;
  if (!detailRows || detailRows.length === 0) return [];

  const freelancerIds = detailRows.map((d) => d.id);

  const [
    { data: profileRows, error: profilesError },
    { data: skillRows, error: skillsError },
    { data: applicationRows, error: applicationsError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", freelancerIds),
    supabase
      .from("freelancer_skills")
      .select("freelancer_id, skills(name)")
      .in("freelancer_id", freelancerIds),
    supabase
      .from("applications")
      .select("freelancer_id")
      .in("freelancer_id", freelancerIds),
  ]);

  if (profilesError) throw profilesError;
  if (skillsError) throw skillsError;
  if (applicationsError) throw applicationsError;

  const profileById = new Map((profileRows ?? []).map((p) => [p.id, p]));
  const headlineById = new Map(detailRows.map((d) => [d.id, d.headline]));

  const skillsByFreelancer = new Map<string, string[]>();
  ((skillRows ?? []) as SkillRow[]).forEach((row) => {
    const skillName = firstOrSelf(row.skills)?.name;
    if (!skillName) return;
    const existing = skillsByFreelancer.get(row.freelancer_id) ?? [];
    skillsByFreelancer.set(row.freelancer_id, [...existing, skillName]);
  });

  const proposalCountByFreelancer = new Map<string, number>();
  (applicationRows ?? []).forEach((row) => {
    const current = proposalCountByFreelancer.get(row.freelancer_id) ?? 0;
    proposalCountByFreelancer.set(row.freelancer_id, current + 1);
  });

  return freelancerIds.map((id): TalentListing => {
    const profile = profileById.get(id);
    return {
      freelancerId: id,
      name: profile?.full_name ?? "Unnamed",
      avatarUrl: profile?.avatar_url ?? null,
      headline: headlineById.get(id) ?? "Freelancer",
      skills: skillsByFreelancer.get(id) ?? [],
      proposalCount: proposalCountByFreelancer.get(id) ?? 0,
    };
  });
}
