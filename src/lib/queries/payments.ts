import { createClient } from "@/lib/supabase/client";

export type MilestoneStatus = "upcoming" | "pending" | "delivered" | "released";
export type TransactionType = "milestone_release" | "withdrawal" | "escrow_fund";
export type TransactionStatus = "pending" | "completed" | "failed";

export type EscrowMilestone = {
  title: string;
  amount: number;
  status: MilestoneStatus;
};

export type EscrowGroup = {
  client: string;
  meta: string;
  milestones: EscrowMilestone[];
};

export type RecentTransaction = {
  title: string;
  meta: string;
  amount: string;
  positive: boolean;
};

export type PaymentsOverviewData = {
  stats: {
    availableBalance: number;
    inEscrow: number;
    pendingRelease: number;
    totalEarnedThisYear: number;
  };
  escrowGroups: EscrowGroup[];
  recentTransactions: RecentTransaction[];
};

export type PaymentHistoryRow = {
  title: string;
  party: string;
  gross: string;
  fee: string;
  received: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  direction: "in" | "out";
};

function formatCurrency(amount: number, signed = false): string {
  const abs = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (!signed) return `$${abs}`;
  return amount < 0 ? `-$${abs}` : `+$${abs}`;
}

function mapTransactionStatus(status: TransactionStatus): "Completed" | "Pending" | "Failed" {
  if (status === "completed") return "Completed";
  if (status === "failed") return "Failed";
  return "Pending";
}

async function getContractsWithMilestones(freelancerId: string) {
  const supabase = createClient();

  const { data: contracts, error } = await supabase
    .from("contracts")
    .select(
      `
      id, status,
      jobs ( title ),
      profiles!contracts_employer_id_fkey ( full_name, employer_details ( company_name ) ),
      milestones ( id, title, amount, status, funded_at, delivered_at, released_at )
    `,
    )
    .eq("freelancer_id", freelancerId);

  if (error) {
    console.error("getContractsWithMilestones failed:", error);
    return [];
  }

  return contracts ?? [];
}

export async function getPaymentsOverview(
  freelancerId: string,
): Promise<PaymentsOverviewData> {
  const supabase = createClient();

  const [contracts, transactionsRes] = await Promise.all([
    getContractsWithMilestones(freelancerId),
    supabase
      .from("transactions")
      .select("id, type, gross_amount, fee_amount, net_amount, status, provider, created_at, milestone_id")
      .eq("user_id", freelancerId)
      .order("created_at", { ascending: false }),
  ]);

  const transactions = transactionsRes.data ?? [];

  // --- Escrow groups + milestone-based stats ---
  let inEscrow = 0;
  let pendingRelease = 0;

  const escrowGroups: EscrowGroup[] = contracts
    .filter((c) => (c.milestones ?? []).length > 0)
    .map((contract) => {
      const job = Array.isArray(contract.jobs) ? contract.jobs[0] : contract.jobs;
      const employerProfile = Array.isArray(contract.profiles)
        ? contract.profiles[0]
        : contract.profiles;
      const employerDetails = Array.isArray(employerProfile?.employer_details)
        ? employerProfile.employer_details[0]
        : employerProfile?.employer_details;

      const milestones = contract.milestones ?? [];
      const total = milestones.reduce((sum, m) => sum + Number(m.amount), 0);

      const mapped: EscrowMilestone[] = milestones.map((m) => {
        const status = m.status as MilestoneStatus;
        if (status === "pending" || status === "delivered") {
          inEscrow += Number(m.amount);
        }
        if (status === "delivered") {
          pendingRelease += Number(m.amount);
        }
        return { title: m.title, amount: Number(m.amount), status };
      });

      return {
        client: employerDetails?.company_name ?? employerProfile?.full_name ?? "Client",
        meta: `${job?.title ?? "Contract"} · $${total.toLocaleString()} total`,
        milestones: mapped,
      };
    });

  // --- Transaction-based stats ---
  const currentYear = new Date().getFullYear();

  const availableBalance = transactions.reduce((sum, t) => {
    if (t.status !== "completed" && !(t.type === "withdrawal" && t.status === "pending")) {
      return sum;
    }
    if (t.type === "milestone_release" && t.status === "completed") {
      return sum + Number(t.net_amount);
    }
    if (t.type === "withdrawal" && (t.status === "completed" || t.status === "pending")) {
      return sum - Number(t.gross_amount);
    }
    return sum;
  }, 0);

  const totalEarnedThisYear = transactions
    .filter(
      (t) =>
        t.type === "milestone_release" &&
        t.status === "completed" &&
        new Date(t.created_at).getFullYear() === currentYear,
    )
    .reduce((sum, t) => sum + Number(t.net_amount), 0);

  // --- Recent transactions (compact, top 4) ---
  const milestoneIds = transactions
    .map((t) => t.milestone_id)
    .filter((id): id is string => Boolean(id));

  let milestoneLabels = new Map<string, string>();
  if (milestoneIds.length > 0) {
    const { data: milestoneRows } = await supabase
      .from("milestones")
      .select("id, title")
      .in("id", milestoneIds);
    milestoneLabels = new Map((milestoneRows ?? []).map((m) => [m.id, m.title]));
  }

  const recentTransactions: RecentTransaction[] = transactions.slice(0, 4).map((t) => {
    const isCredit = t.type === "milestone_release";
    const label =
      t.type === "withdrawal" ?
        `Withdrawal — ${t.provider ?? "Payout"}`
      : (milestoneLabels.get(t.milestone_id ?? "") ?? "Milestone Payment");

    const signedAmount = isCredit ? Number(t.net_amount) : -Number(t.gross_amount);

    return {
      title: label,
      meta: `${mapTransactionStatus(t.status as TransactionStatus)} · ${new Date(t.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`,
      amount: formatCurrency(signedAmount, true),
      positive: isCredit,
    };
  });

  return {
    stats: {
      availableBalance,
      inEscrow,
      pendingRelease,
      totalEarnedThisYear,
    },
    escrowGroups,
    recentTransactions,
  };
}

export async function getPaymentHistory(freelancerId: string): Promise<PaymentHistoryRow[]> {
  const supabase = createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, type, gross_amount, fee_amount, net_amount, status, provider, created_at, milestone_id")
    .eq("user_id", freelancerId)
    .order("created_at", { ascending: false });

  if (!transactions || transactions.length === 0) return [];

  const milestoneIds = transactions
    .map((t) => t.milestone_id)
    .filter((id): id is string => Boolean(id));

  let milestoneInfo = new Map<string, { title: string; contractId: string }>();
  if (milestoneIds.length > 0) {
    const { data: milestoneRows } = await supabase
      .from("milestones")
      .select("id, title, contract_id")
      .in("id", milestoneIds);
    milestoneInfo = new Map(
      (milestoneRows ?? []).map((m) => [m.id, { title: m.title, contractId: m.contract_id }]),
    );
  }

  const contractIds = Array.from(new Set(Array.from(milestoneInfo.values()).map((m) => m.contractId)));

  let contractParty = new Map<string, string>();
  if (contractIds.length > 0) {
    const { data: contractRows } = await supabase
      .from("contracts")
      .select(
        `
        id,
        profiles!contracts_employer_id_fkey ( full_name, employer_details ( company_name ) )
      `,
      )
      .in("id", contractIds);

    contractParty = new Map(
      (contractRows ?? []).map((c) => {
        const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
        const details = Array.isArray(profile?.employer_details)
          ? profile.employer_details[0]
          : profile?.employer_details;
        return [c.id, details?.company_name ?? profile?.full_name ?? "Client"];
      }),
    );
  }

  return transactions.map((t): PaymentHistoryRow => {
    const isWithdrawal = t.type === "withdrawal";
    const milestone = milestoneInfo.get(t.milestone_id ?? "");
    const party = isWithdrawal
      ? "TalentQ Wallet"
      : (milestone ? contractParty.get(milestone.contractId) : undefined) ?? "Client";

    const title = isWithdrawal
      ? `Withdrawal — ${t.provider ?? "Payout"}`
      : (milestone?.title ?? "Milestone Payment");

    const gross = Number(t.gross_amount);
    const fee = Number(t.fee_amount);
    const net = Number(t.net_amount);

    return {
      title,
      party,
      gross: isWithdrawal ? formatCurrency(gross) : formatCurrency(gross, true),
      fee: fee > 0 ? `-${formatCurrency(fee)}` : "-",
      received: isWithdrawal ? `-${formatCurrency(gross)}` : formatCurrency(net, true),
      date: new Date(t.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: mapTransactionStatus(t.status as TransactionStatus),
      direction: isWithdrawal ? "out" : "in",
    };
  });
}