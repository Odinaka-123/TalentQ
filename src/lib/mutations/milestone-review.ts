import { SupabaseClient } from "@supabase/supabase-js";

const PLATFORM_FEE_RATE = 0.1;

export async function approveMilestone(
  supabase: SupabaseClient,
  milestoneId: string,
) {
  const { data: milestone, error: fetchError } = await supabase
    .from("milestones")
    .select("id, amount, status, contract_id, contracts(freelancer_id)")
    .eq("id", milestoneId)
    .single();

  if (fetchError || !milestone)
    throw fetchError ?? new Error("Milestone not found");
  if (milestone.status !== "delivered") {
    throw new Error("Only delivered milestones can be approved");
  }

  const contract =
    Array.isArray(milestone.contracts) ?
      milestone.contracts[0]
    : milestone.contracts;
  if (!contract) throw new Error("Contract not found for this milestone");

  const gross = Number(milestone.amount);
  const fee = Math.round(gross * PLATFORM_FEE_RATE * 100) / 100;
  const net = gross - fee;

  const { error: txnError } = await supabase.from("transactions").insert({
    user_id: contract.freelancer_id,
    milestone_id: milestone.id,
    type: "milestone_release",
    gross_amount: gross,
    fee_amount: fee,
    net_amount: net,
    provider: "internal",
    status: "completed",
  });

  if (txnError) throw txnError;

  const { error: updateError } = await supabase
    .from("milestones")
    .update({ status: "released", released_at: new Date().toISOString() })
    .eq("id", milestoneId);

  if (updateError) throw updateError;
}

export async function requestRevision(
  supabase: SupabaseClient,
  milestoneId: string,
) {
  const { error } = await supabase
    .from("milestones")
    .update({ status: "pending", delivered_at: null })
    .eq("id", milestoneId)
    .eq("status", "delivered"); // guard: only revert if actually awaiting review

  if (error) throw error;
}
