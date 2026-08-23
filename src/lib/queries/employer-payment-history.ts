import { createClient } from "@/lib/supabase/client";

export type EmployerTransaction = {
  id: string;
  title: string;
  freelancerName: string;
  gross: number;
  fee: number;
  net: number;
  date: string;
  status: "pending" | "completed" | "failed";
};

type TransactionRow = {
  id: string;
  gross_amount: number;
  fee_amount: number;
  net_amount: number;
  status: string;
  created_at: string;
  milestone_id: string;
};

type MilestoneRow = {
  id: string;
  title: string;
  contract_id: string;
};

type ContractRow = {
  id: string;
  freelancer_id: string;
  profiles: { full_name: string } | { full_name: string }[] | null;
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getEmployerPaymentHistory(
  employerId: string,
): Promise<EmployerTransaction[]> {
  const supabase = createClient();

  // Resolve via the contract chain rather than trusting transactions.user_id
  // semantics, which were never confirmed for escrow_fund rows.
  const { data: contractRowsRaw } = await supabase
    .from("contracts")
    .select(
      "id, freelancer_id, profiles!contracts_freelancer_id_fkey(full_name)",
    )
    .eq("employer_id", employerId);

  const contractRows = (contractRowsRaw ?? []) as ContractRow[];
  const contractIds = contractRows.map((c) => c.id);
  if (contractIds.length === 0) return [];

  const freelancerNameByContract = new Map(
    contractRows.map((c) => [
      c.id,
      firstOrSelf(c.profiles)?.full_name ?? "Unknown",
    ]),
  );

  const { data: milestoneRowsRaw } = await supabase
    .from("milestones")
    .select("id, title, contract_id")
    .in("contract_id", contractIds);

  const milestoneRows = (milestoneRowsRaw ?? []) as MilestoneRow[];
  const milestoneIds = milestoneRows.map((m) => m.id);
  if (milestoneIds.length === 0) return [];

  const milestoneById = new Map(milestoneRows.map((m) => [m.id, m]));

  const { data: txnRowsRaw } = await supabase
    .from("transactions")
    .select(
      "id, gross_amount, fee_amount, net_amount, status, created_at, milestone_id",
    )
    .in("milestone_id", milestoneIds)
    .eq("type", "escrow_fund")
    .order("created_at", { ascending: false });

  const txnRows = (txnRowsRaw ?? []) as TransactionRow[];

  return txnRows.map((t) => {
    const milestone = milestoneById.get(t.milestone_id);
    const contractId = milestone?.contract_id;
    return {
      id: t.id,
      title: milestone?.title ?? "Untitled milestone",
      freelancerName:
        contractId ?
          (freelancerNameByContract.get(contractId) ?? "Unknown")
        : "Unknown",
      gross: Number(t.gross_amount),
      fee: Number(t.fee_amount),
      net: Number(t.net_amount),
      date: t.created_at,
      status: t.status as "pending" | "completed" | "failed",
    };
  });
}
