"use client";

import { useEffect, useState } from "react";
import { Wallet, Lock, Clock, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getPaymentsOverview,
  type PaymentsOverviewData,
} from "@/lib/queries/payments";
import EscrowTimeline from "./EscrowTimeline";
import StatCard from "./StatCard";
import RecentTransactions from "./RecentTransactions";

function formatMoney(amount: number) {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function PaymentsOverview() {
  const [data, setData] = useState<PaymentsOverviewData | null>(null);
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
        const overview = await getPaymentsOverview(user.id);
        if (!cancelled) {
          setData(overview);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load payments overview:", err);
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

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 sm:p-5 h-26 animate-pulse"
            />
          ))}
        </div>
        <div className="bg-white rounded-2xl h-64 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#6B7A73]">
        Couldn&apos;t load your payments right now. Try refreshing the page.
      </div>
    );
  }

  const { stats, escrowGroups, recentTransactions } = data;

  const statCards = [
    {
      label: "Available Balance",
      value: formatMoney(stats.availableBalance),
      meta: "Ready to withdraw",
      icon: Wallet,
      iconBg: "#E3F2E8",
      iconColor: "#2F8C4D",
    },
    {
      label: "In Escrow",
      value: formatMoney(stats.inEscrow),
      meta: "Held until milestones complete",
      icon: Lock,
      iconBg: "#FCEFE3",
      iconColor: "#D97757",
    },
    {
      label: "Pending Release",
      value: formatMoney(stats.pendingRelease),
      meta: "Delivered, awaiting client approval",
      icon: Clock,
      iconBg: "#E8F0FE",
      iconColor: "#3B82F6",
    },
    {
      label: "Earned This Year",
      value: formatMoney(stats.totalEarnedThisYear),
      meta: `Jan 1 – ${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
      icon: TrendingUp,
      iconBg: "#EFE8FB",
      iconColor: "#8A5FD6",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            label={stat.label}
            value={stat.value}
            meta={stat.meta}
          />
        ))}
      </div>

      {/* Escrow groups + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {escrowGroups.length === 0 ?
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#6B7A73]">
              No active escrow contracts yet.
            </div>
          : <EscrowTimeline
              groups={escrowGroups.map((group) => ({
                client: group.client,
                meta: group.meta,
                milestones: group.milestones.map((m) => ({
                  title: m.title,
                  amount: formatMoney(m.amount),
                  status: m.status,
                })),
              }))}
            />
          }
        </div>

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
