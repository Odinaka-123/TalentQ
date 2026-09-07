"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useEffect, useState } from "react";
import { Wallet, Lock, Clock, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getPaymentsOverview,
  type PaymentsOverviewData,
} from "@/lib/queries/payments";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import EscrowTimeline from "./EscrowTimeline";
import StatCard from "./StatCard";
import RecentTransactions from "./RecentTransactions";

export default function PaymentsOverview() {
    const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
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

  const handleDelivered = (milestoneId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        escrowGroups: prev.escrowGroups.map((group) => ({
          ...group,
          milestones: group.milestones.map((m) =>
            m.id === milestoneId ? { ...m, status: "delivered" as const } : m,
          ),
        })),
      };
    });
  };

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
        {t("app_freelancer_payments_components_payments_overview.couldn_t_load_your_payments_right_now_tr")}</div>
    );
  }

  const { stats, escrowGroups, recentTransactions } = data;

  const statCards = [
    {
      label: "Available Balance",
      value: formatCurrency(stats.availableBalance),
      meta: "Ready to withdraw",
      icon: Wallet,
      iconBg: "#E3F2E8",
      iconColor: "#2F8C4D",
    },
    {
      label: "In Escrow",
      value: formatCurrency(stats.inEscrow),
      meta: "Held until milestones complete",
      icon: Lock,
      iconBg: "#FCEFE3",
      iconColor: "#D97757",
    },
    {
      label: "Pending Release",
      value: formatCurrency(stats.pendingRelease),
      meta: "Delivered, awaiting client approval",
      icon: Clock,
      iconBg: "#E8F0FE",
      iconColor: "#3B82F6",
    },
    {
      label: "Earned This Year",
      value: formatCurrency(stats.totalEarnedThisYear),
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
              {t("app_freelancer_payments_components_payments_overview.no_active_escrow_contracts_yet")}</div>
          : <EscrowTimeline
              groups={escrowGroups.map((group) => ({
                client: group.client,
                meta: group.meta,
                milestones: group.milestones.map((m) => ({
                  id: m.id,
                  title: m.title,
                  amount: formatCurrency(m.amount),
                  status: m.status,
                })),
              }))}
              onDelivered={handleDelivered}
            />
          }
        </div>

        <RecentTransactions
          transactions={recentTransactions.map((t) => ({
            title: t.title,
            meta: t.meta,
            amount: formatCurrency(t.amountNgn, true),
            positive: t.positive,
          }))}
        />
      </div>
    </div>
  );
}
