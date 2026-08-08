import { Wallet, Lock, Clock, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import EscrowTimeline from "./EscrowTimeline";
import RecentTransactions from "./RecentTransactions";
import { Percent } from "lucide-react";

const escrowGroups = [
  {
    client: "Cloudscale Technologies",
    meta: "React Dashboard · $1,600 total",
    milestones: [
      {
        title: "Setup & Architecture",
        amount: "$400",
        status: "released" as const,
      },
      { title: "Core Components", amount: "$400", status: "released" as const },
      { title: "Integrations", amount: "$400", status: "pending" as const },
    ],
  },
  {
    client: "PocketFund",
    meta: "UI Design Sprint · $850 total",
    milestones: [
      {
        title: "Research & Audit",
        amount: "$350",
        status: "released" as const,
      },
      { title: "Wireframes", amount: "$350", status: "pending" as const },
      { title: "Final Handoff", amount: "$175", status: "upcoming" as const },
    ],
  },
];

const transactions = [
  {
    title: "Milestone 2 — Dashboard Module",
    meta: "Cloudscale Technologies · Jul 28, 2026",
    amount: "+$1,000",
    positive: true,
  },
  {
    title: "Withdrawal — Payoneer",
    meta: "Processed · Jul 15, 2026",
    amount: "-$850",
    positive: false,
  },
  {
    title: "Withdrawal — Payoneer",
    meta: "Processed · Jul 8, 2026",
    amount: "-$500",
    positive: false,
  },
  {
    title: "Milestone 1 — Analytics Chart",
    meta: "Cloudscale Technologies · Jul 4, 2026",
    amount: "+$1,600",
    positive: true,
  },
];

export default function PaymentsOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          iconBg="#F4E3C9"
          iconColor="#B9862F"
          label="Available Balance"
          value="$2,020.50"
        />
        <StatCard
          icon={Lock}
          iconBg="#D8E7DE"
          iconColor="#3E8E5A"
          label="In Escrow"
          value="$1,800.00"
        />
        <StatCard
          icon={Clock}
          iconBg="#F7DCC8"
          iconColor="#DE814A"
          label="Pending Release"
          value="$112.50"
        />
        <StatCard
          icon={TrendingUp}
          iconBg="#E4D9F2"
          iconColor="#8A5FC7"
          label="Total Earned (2026)"
          value="$2,020.50"
        />
      </div>

      <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 py-4 flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#A8531E] shrink-0">
          <Percent size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1F2A22]">
            You keep 90% of every payment
          </p>
          <p className="text-xs text-[#8A8A7E] mt-0.5">
            TalentQ takes a flat 10% service fee. No hidden charges. No
            withdrawal fees.
          </p>
        </div>
      </div>

      <EscrowTimeline groups={escrowGroups} />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
