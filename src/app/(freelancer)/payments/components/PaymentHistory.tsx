"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getPaymentHistory,
  type PaymentHistoryRow,
} from "@/lib/queries/payments";

const statusStyles: Record<
  PaymentHistoryRow["status"],
  { icon: typeof CheckCircle2; bg: string; fg: string }
> = {
  Completed: { icon: CheckCircle2, bg: "bg-[#D8E7DE]", fg: "text-[#3E8E5A]" },
  Pending: { icon: Clock, bg: "bg-[#FBEADB]", fg: "text-[#DE814A]" },
  Failed: { icon: XCircle, bg: "bg-[#FBE9E5]", fg: "text-[#C6543A]" },
};

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState<PaymentHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
        return;
      }

      try {
        const rows = await getPaymentHistory(user.id);
        if (!cancelled) {
          setTransactions(rows);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load payment history:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 py-4">
        <p className="text-sm text-[#1F2A22]">
          All fees shown at the 10% TalentQ service rate. Withdrawal
          transactions carry no additional fee.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E5E0D6] bg-white overflow-x-auto">
        {loading ?
          <div className="p-6 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-[#F5F1E9] rounded animate-pulse"
              />
            ))}
          </div>
        : error ?
          <div className="p-6 text-center text-sm text-[#8A8A7E]">
            Couldn&apos;t load your payment history right now. Try refreshing
            the page.
          </div>
        : transactions.length === 0 ?
          <div className="p-6 text-center text-sm text-[#8A8A7E]">
            No transactions yet.
          </div>
        : <table className="w-full min-w-160 text-sm">
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
              {transactions.map((t, i) => {
                const statusStyle = statusStyles[t.status];
                return (
                  <tr key={i}>
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                            t.direction === "in" ?
                              "bg-[#D8E7DE]"
                            : "bg-[#F2E4D4]"
                          }`}
                        >
                          {t.direction === "in" ?
                            <ArrowUpRight
                              size={14}
                              className="text-[#3E8E5A]"
                            />
                          : <ArrowDownLeft
                              size={14}
                              className="text-[#B9862F]"
                            />
                          }
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
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${statusStyle.bg} ${statusStyle.fg}`}
                      >
                        <statusStyle.icon size={12} />
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
