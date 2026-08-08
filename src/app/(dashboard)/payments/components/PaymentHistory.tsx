import { ArrowUpRight, ArrowDownLeft, CheckCircle2 } from "lucide-react";

type Transaction = {
  title: string;
  party: string;
  gross: string;
  fee: string;
  received: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  direction: "in" | "out";
};

const transactions: Transaction[] = [
  {
    title: "Milestone 2 — Dashboard Module",
    party: "Cloudscale Technologies",
    gross: "+$1,350",
    fee: "-$150",
    received: "+$1,350",
    date: "Jul 28, 2026",
    status: "Completed",
    direction: "in",
  },
  {
    title: "Milestone 1 — UX Audit",
    party: "PocketFund",
    gross: "$875",
    fee: "-$87.5",
    received: "+$787.5",
    date: "Jul 15, 2026",
    status: "Completed",
    direction: "in",
  },
  {
    title: "Withdrawal — Paystack",
    party: "TalentQ Wallet",
    gross: "$1,000",
    fee: "-",
    received: "-$1,000",
    date: "Jul 10, 2026",
    status: "Completed",
    direction: "out",
  },
  {
    title: "Milestone 3 — Analytics Charts",
    party: "Cloudscale Technologies",
    gross: "$2,000",
    fee: "-$87.5",
    received: "+$1,800",
    date: "Jun 30, 2026",
    status: "Completed",
    direction: "in",
  },
  {
    title: "Blog Articles — June Batch",
    party: "Techpulse Media",
    gross: "$400",
    fee: "-$40",
    received: "+$360",
    date: "Jun 22, 2026",
    status: "Completed",
    direction: "in",
  },
  {
    title: "Withdrawal — Bank Transfer",
    party: "TalentQ Wallet",
    gross: "$1,200",
    fee: "-",
    received: "-$1,200",
    date: "Jun 15, 2026",
    status: "Completed",
    direction: "out",
  },
];

export default function PaymentHistory() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 py-4">
        <p className="text-sm text-[#1F2A22]">
          All fees shown at the 10% TalentQ service rate. Withdrawal
          transactions carry no additional fee.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E5E0D6] bg-white overflow-x-auto">
        <table className="w-full min-w-160 text-sm">
          <thead>
            <tr className="border-b border-[#EFEBE2] text-left text-xs text-[#8A8A7E]">
              <th className="px-5 sm:px-6 py-4 font-medium">Transaction</th>
              <th className="px-4 py-4 font-medium">From / To</th>
              <th className="px-4 py-4 font-medium">Gross</th>
              <th className="px-4 py-4 font-medium">Platform Fee (10%)</th>
              <th className="px-4 py-4 font-medium">Received</th>
              <th className="px-4 py-4 font-medium">Date</th>
              <th className="px-5 sm:px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEBE2]">
            {transactions.map((t, i) => (
              <tr key={i}>
                <td className="px-5 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                        t.direction === "in" ? "bg-[#D8E7DE]" : "bg-[#F2E4D4]"
                      }`}
                    >
                      {t.direction === "in" ?
                        <ArrowUpRight size={14} className="text-[#3E8E5A]" />
                      : <ArrowDownLeft size={14} className="text-[#B9862F]" />}
                    </div>
                    <span className="text-[#1F2A22]">{t.title}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[#5C5347]">{t.party}</td>
                <td className="px-4 py-4 text-[#1F2A22]">{t.gross}</td>
                <td className="px-4 py-4 text-[#C6543A]">{t.fee}</td>
                <td
                  className={`px-4 py-4 font-medium ${
                    t.received.startsWith("-") ?
                      "text-[#C6543A]"
                    : "text-[#3E8E5A]"
                  }`}
                >
                  {t.received}
                </td>
                <td className="px-4 py-4 text-[#8A8A7E]">{t.date}</td>
                <td className="px-5 sm:px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D8E7DE] px-2.5 py-1 text-xs text-[#3E8E5A]">
                    <CheckCircle2 size={12} />
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
