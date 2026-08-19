import { createClient } from "@/lib/supabase/client";

export type FreelancerSettings = {
  fullName: string;
  email: string;
  headline: string;
  country: string;
  hourlyRate: string;
  workType: string;
  availability: "available" | "busy" | "unavailable";
  avatarUrl: string | null;
};

export async function getFreelancerSettings(
  userId: string,
): Promise<FreelancerSettings | null> {
  const supabase = createClient();

  const [{ data: profile }, { data: details }, { data: userRes }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single(),
      supabase
        .from("freelancer_details")
        .select("headline, hourly_rate, availability, country, work_type")
        .eq("id", userId)
        .single(),
      supabase.auth.getUser(),
    ]);

  if (!profile) return null;

  const availability = details?.availability;
  const normalizedAvailability: FreelancerSettings["availability"] =
    availability === "busy" || availability === "unavailable" ?
      availability
    : "available";

  return {
    fullName: profile.full_name ?? "",
    email: userRes.user?.email ?? "",
    headline: details?.headline ?? "",
    country: details?.country ?? "",
    hourlyRate: details?.hourly_rate != null ? String(details.hourly_rate) : "",
    workType: details?.work_type ?? "",
    availability: normalizedAvailability,
    avatarUrl: profile.avatar_url ?? null,
  };
}

export async function updateProfileInformation(
  userId: string,
  updates: {
    fullName: string;
    headline: string;
    country: string;
    hourlyRate: string;
    workType: string;
  },
) {
  const supabase = createClient();

  const parsedRate =
    updates.hourlyRate.trim() === "" ?
      null
    : Number(updates.hourlyRate.replace(/[^0-9.]/g, ""));

  const [profileRes, detailsRes] = await Promise.all([
    supabase
      .from("profiles")
      .update({ full_name: updates.fullName })
      .eq("id", userId),
    supabase
      .from("freelancer_details")
      .update({
        headline: updates.headline,
        country: updates.country,
        hourly_rate: parsedRate,
        work_type: updates.workType,
      })
      .eq("id", userId),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (detailsRes.error) throw detailsRes.error;
}

export async function updateAvailability(
  userId: string,
  availability: "available" | "busy" | "unavailable",
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("freelancer_details")
    .update({ availability })
    .eq("id", userId);

  if (error) throw error;
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const supabase = createClient();

  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  const avatarUrl = publicUrlData.publicUrl;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (profileError) throw profileError;

  return avatarUrl;
}
