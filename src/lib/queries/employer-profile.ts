import { createClient } from "@/lib/supabase/client";

export type EmployerProfileData = {
  fullName: string;
  avatarUrl: string | null;
  companyName: string;
  industry: string;
  country: string;
  companySize: string;
  budgetRange: string;
};

type ProfileRow = {
  full_name: string | null;
  avatar_url: string | null;
  employer_details:
    | {
        company_name: string | null;
        industry: string | null;
        country: string | null;
        company_size: string | null;
        budget_range: string | null;
      }
    | {
        company_name: string | null;
        industry: string | null;
        country: string | null;
        company_size: string | null;
        budget_range: string | null;
      }[]
    | null;
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getEmployerProfile(
  userId: string,
): Promise<EmployerProfileData> {
  const supabase = createClient();

  const { data } = await supabase
    .from("profiles")
    .select(
      "full_name, avatar_url, employer_details ( company_name, industry, country, company_size, budget_range )",
    )
    .eq("id", userId)
    .single();

  const row = data as ProfileRow | null;
  const details = firstOrSelf(row?.employer_details);

  return {
    fullName: row?.full_name ?? "",
    avatarUrl: row?.avatar_url ?? null,
    companyName: details?.company_name ?? "",
    industry: details?.industry ?? "",
    country: details?.country ?? "",
    companySize: details?.company_size ?? "",
    budgetRange: details?.budget_range ?? "",
  };
}

export async function updateEmployerProfile(
  userId: string,
  fields: EmployerProfileData,
): Promise<void> {
  const supabase = createClient();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fields.fullName })
    .eq("id", userId);

  if (profileError) throw profileError;

  const { error: detailsError } = await supabase
    .from("employer_details")
    .upsert({
      id: userId,
      company_name: fields.companyName,
      industry: fields.industry,
      country: fields.country,
      company_size: fields.companySize,
      budget_range: fields.budgetRange,
    });

  if (detailsError) throw detailsError;
}
