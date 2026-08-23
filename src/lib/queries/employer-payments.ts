import { createClient } from "@/lib/supabase/client";

export type ActiveMilestone = {
  id: string;
  title: string;
  freelancerName: string;
  dueDate: string | null;
  status: "pending" | "delivered";
  amount: number;
};

export type EmployerPaymentsOverview = {
  totalFunded: number;
  inEscrow: number;
  activeMilestones: ActiveMilestone[];
};

type MilestoneRow = {
  id: string;
  contract_id: string;
  title: string;
  amount: number;
  status: string;
  due_date: string | null;
  funded_at: string | null;
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

export async function getEmployerPaymentsOverview(
  employerId: string,
): Promise<EmployerPaymentsOverview> {
  const supabase = createClient();

  const { data: contractRowsRaw } = await supabase
    .from("contracts")
    .select(
      "id, freelancer_id, profiles!contracts_freelancer_id_fkey(full_name)",
    )
    .eq("employer_id", employerId);

  const contractRows = (contractRowsRaw ?? []) as ContractRow[];
  const contractIds = contractRows.map((c) => c.id);
  const freelancerNameByContract = new Map(
    contractRows.map((c) => [
      c.id,
      firstOrSelf(c.profiles)?.full_name ?? "Unknown",
    ]),
  );

  if (contractIds.length === 0) {
    return { totalFunded: 0, inEscrow: 0, activeMilestones: [] };
  }

  const { data: milestoneRowsRaw } = await supabase
    .from("milestones")
    .select("id, contract_id, title, amount, status, due_date, funded_at")
    .in("contract_id", contractIds);

  const milestoneRows = (milestoneRowsRaw ?? []) as MilestoneRow[];

  const totalFunded = milestoneRows
    .filter((m) => m.funded_at !== null)
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const inEscrow = milestoneRows
    .filter((m) => m.status === "pending" || m.status === "delivered")
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const activeMilestones: ActiveMilestone[] = milestoneRows
    .filter((m) => m.status === "pending" || m.status === "delivered")
    .map((m) => ({
      id: m.id,
      title: m.title,
      freelancerName: freelancerNameByContract.get(m.contract_id) ?? "Unknown",
      dueDate: m.due_date,
      status: m.status as "pending" | "delivered",
      amount: Number(m.amount),
    }));

  return { totalFunded, inEscrow, activeMilestones };
}
