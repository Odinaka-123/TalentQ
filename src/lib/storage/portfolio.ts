import { SupabaseClient } from "@supabase/supabase-js";

const PORTFOLIO_BUCKET = "portfolio-images"; // ← confirm this matches your actual bucket name

export async function uploadPortfolioImage(
  supabase: SupabaseClient,
  userId: string,
  file: File,
) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(PORTFOLIO_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path);

  return publicUrl;
}
