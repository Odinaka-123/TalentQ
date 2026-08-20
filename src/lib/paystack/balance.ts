import { SupabaseClient } from "@supabase/supabase-js";

export async function getAvailableBalance(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { data: transactions } = await supabase
    .from("transactions")
    .select("type, gross_amount, net_amount, status")
    .eq("user_id", userId);

  return (transactions ?? []).reduce((sum, t) => {
    if (t.type === "milestone_release" && t.status === "completed") {
      return sum + Number(t.net_amount);
    }
    if (
      t.type === "withdrawal" &&
      (t.status === "completed" || t.status === "pending")
    ) {
      // Deduct the full requested amount, not just what lands in the
      // freelancer's bank — the 10% withdrawal fee still leaves the wallet.
      return sum - Number(t.gross_amount);
    }
    return sum;
  }, 0);
}
