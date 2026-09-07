// src/lib/queries/language.ts
import { createClient } from "@/lib/supabase/client";
import type { LanguageCode } from "@/lib/i18n/translations";

export async function getPreferredLanguage(
  userId: string,
): Promise<LanguageCode> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("preferred_language")
    .eq("id", userId)
    .single();

  return (data?.preferred_language as LanguageCode) ?? "en-GB";
}

export async function updatePreferredLanguage(
  userId: string,
  language: LanguageCode,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ preferred_language: language })
    .eq("id", userId);

  if (error) throw error;
}
