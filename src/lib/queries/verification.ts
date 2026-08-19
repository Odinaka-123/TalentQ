import { createClient } from "@/lib/supabase/client";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export async function getVerificationStatus(userId: string) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("identity_verification_status")
    .eq("id", userId)
    .single();

  const { data: submissions } = await supabase
    .from("verification_submissions")
    .select("id, method, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return {
    status: (profile?.identity_verification_status ??
      "unverified") as VerificationStatus,
    submissions: submissions ?? [],
  };
}

export async function submitLinkedInVerification(
  userId: string,
  linkedInProfile: { name: string; headline?: string; photoUrl?: string },
) {
  const supabase = createClient();

  const { error: submissionError } = await supabase
    .from("verification_submissions")
    .insert({
      user_id: userId,
      method: "linkedin",
      status: "pending",
      submitted_data: linkedInProfile,
    });

  if (submissionError) return { error: submissionError };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ identity_verification_status: "pending" })
    .eq("id", userId);

  return { error: profileError };
}

export async function createDiditSession(userId: string) {
  const res = await fetch("/api/verification/didit/create-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    return { error: "Failed to start verification session", sessionUrl: null };
  }

  const data = await res.json();
  return { error: null, sessionUrl: data.sessionUrl as string };
}
