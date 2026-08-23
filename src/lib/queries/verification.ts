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

export async function checkDiditStatus(userId: string) {
  const res = await fetch("/api/verification/didit/check-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? "Failed to check status", status: null };
  }

  const data = await res.json();
  return { error: null, status: data.status as VerificationStatus };
}

export async function getClientReviewedStatus(
  userId: string,
): Promise<boolean> {
  const supabase = createClient();

  const { count } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("reviewee_id", userId);

  return (count ?? 0) > 0;
}

// --- Employer-specific additions below ---

export type SubmissionMethodStatus =
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected";

export type EmployerVerificationStatus = {
  companyRegistration: SubmissionMethodStatus;
  linkedin: SubmissionMethodStatus;
  clientReviewed: boolean;
};

function latestStatusForMethod(
  submissions: { method: string; status: string }[],
  method: string,
): SubmissionMethodStatus {
  const match = submissions.find((s) => s.method === method);
  if (!match) return "not_submitted";
  if (match.status === "verified" || match.status === "approved") {
    return "approved";
  }
  if (match.status === "rejected") return "rejected";
  return "pending";
}

export async function getEmployerVerificationStatus(
  userId: string,
): Promise<EmployerVerificationStatus> {
  const { submissions } = await getVerificationStatus(userId);
  const clientReviewed = await getClientReviewedStatus(userId);

  return {
    companyRegistration: latestStatusForMethod(
      submissions,
      "company_registration",
    ),
    linkedin: latestStatusForMethod(submissions, "linkedin"),
    clientReviewed,
  };
}

export async function submitCompanyRegistration(
  userId: string,
  documentUrl: string,
) {
  const supabase = createClient();

  const { error } = await supabase.from("verification_submissions").insert({
    user_id: userId,
    method: "company_registration",
    status: "pending",
    submitted_data: { documentUrl },
  });

  return { error };
}
