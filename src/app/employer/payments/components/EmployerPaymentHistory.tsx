"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getEmployerPaymentHistory,
  type EmployerTransaction,
} from "@/lib/queries/employer-payment-history";

const statusStyles: Record<
  EmployerTransaction["status"],
  { bg: string; color: string; icon: typeof CheckCircle2; label: string }
> = {
  completed: { bg: "#D8E7DE", color: "#3E8E5A", icon: CheckCircle2, label: "Completed" },
  pending: { bg: "#F2DFC8", color: "#DE814A", icon: Clock, label: "Pending" },
  failed: { bg: "#F7DADA", color: "#C6543A", icon: XCircle, label: "Failed" },
};

export default function EmployerPaymentHistory() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<EmployerTransaction[]>([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const result = await getEmployerPaymentHistory(user.id);
      setTransactions(result);
      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading) {
    return <div className="rounded-2xl bg-white h-64 animate-pulse" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 py-4">
        <p className="text-sm text-[#1F2A22]">
          All fees shown at the 10% TalentQ service rate.
        </p>
      </div>

      {transactions.length === 0 ?
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
          No payments yet.
        </div>
      : <div className="rounded-2xl border border-[#E5E0D6] bg-white overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-[#EFEBE2] text-left text-xs text-[#8A8A7E]">
                <th className="px-5 sm:px-6 py-4 font-medium">Transaction</th>
                <th className="px-4 py-4 font-medium">To</th>
                <th className="px-4 py-4 font-medium">Gross</th>
                <th className="px-4 py-4 font-medium">Platform Fee</th>
                <th className="px-4 py-4 font-medium">Net</th>
                <th className="px-4 py-4 font-medium">Date</th>
                <th className="px-5 sm:px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE2]">
              {transactions.map((t) => {
                const style = statusStyles[t.status];
                return (
                  <tr key={t.id}>
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F2E4D4] shrink-0">
                          <ArrowDownLeft size={14} className="text-[#B9862F]" />
                        </div>
                        <span className="text-[#1F2A22]">{t.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#5C5347]">{t.freelancerName}</td>
                    <td className="px-4 py-4 text-[#1F2A22]">
                      ${t.gross.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-[#C6543A]">
                      -${t.fee.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-medium text-[#1F2A22]">
                      ${t.net.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-[#8A8A7E]">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        <style.icon size={12} />
                        {style.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}