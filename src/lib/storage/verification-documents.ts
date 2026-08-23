import { SupabaseClient } from "@supabase/supabase-js";

const VERIFICATION_BUCKET = "verification-documents";

export async function uploadCompanyDocument(
  supabase: SupabaseClient,
  userId: string,
  file: File,
) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/company-registration.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(VERIFICATION_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (uploadError) throw uploadError;

  // Private bucket — store the path, not a public URL. Fetch it later via
  // a signed URL (createSignedUrl), scoped to whoever has permission to
  // review it, once an admin review flow exists.
  return path;
}
