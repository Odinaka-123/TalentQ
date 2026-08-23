import { SupabaseClient } from "@supabase/supabase-js";

const AVATAR_BUCKET = "avatars";

export async function uploadAvatarImage(
  supabase: SupabaseClient,
  userId: string,
  file: File,
) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  // cache-bust so a same-path re-upload doesn't show the stale cached image
  return `${publicUrl}?t=${Date.now()}`;
}
