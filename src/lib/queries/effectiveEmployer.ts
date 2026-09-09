import { createClient } from "@/lib/supabase/client";

export async function getEffectiveEmployerId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("get_effective_employer_id", {
    uid: user.id,
  });

  if (error || !data) return null;
  return data as string;
}
