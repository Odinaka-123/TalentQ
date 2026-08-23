import { SupabaseClient } from "@supabase/supabase-js";

export async function inviteTeamMember(
  supabase: SupabaseClient,
  employerId: string,
  invite: { email: string; role: string },
) {
  const { data, error } = await supabase
    .from("team_members")
    .insert({
      employer_id: employerId,
      email: invite.email,
      role: invite.role,
      status: "Pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeTeamMember(
  supabase: SupabaseClient,
  memberId: string,
) {
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId);

  if (error) throw error;
}
