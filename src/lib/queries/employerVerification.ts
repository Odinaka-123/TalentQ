import { createClient } from "@/lib/supabase/client";
import type { VerificationStatus } from "@/lib/queries/verification";

export async function getEmployerVerificationStatus(userId: string) {
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

  const companyRegSubmission = submissions?.find(
    (s) => s.method === "company_registration",
  );
  const linkedInSubmission = submissions?.find((s) => s.method === "linkedin");

  const { count: reviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("reviewee_id", userId);

  return {
    identityStatus: (profile?.identity_verification_status ??
      "unverified") as VerificationStatus,
    companyRegistrationStatus: (companyRegSubmission?.status ??
      "unverified") as VerificationStatus,
    linkedInStatus: (linkedInSubmission?.status ??
      "unverified") as VerificationStatus,
    employerReviewed: (reviewCount ?? 0) > 0,
  };
}

export async function submitCompanyRegistration(userId: string, file: File) {
  const supabase = createClient();

  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("business-documents")
    .upload(filePath, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { error: submissionError } = await supabase
    .from("verification_submissions")
    .insert({
      user_id: userId,
      method: "company_registration",
      status: "pending",
      submitted_data: { file_path: filePath, file_name: file.name },
    });

  return { error: submissionError?.message ?? null };
}
