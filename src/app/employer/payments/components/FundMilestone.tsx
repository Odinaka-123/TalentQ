"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getUnfundedMilestones,
  type UnfundedMilestone,
} from "@/lib/queries/unfunded-milestones";

type MilestoneInfo = {
  id: string;
  title: string;
  amount: number;
};

export default function FundMilestone() {
  const router = useRouter();
  const params = useSearchParams();
  const milestoneId = params.get("milestone");

  const [milestone, setMilestone] = useState<MilestoneInfo | null>(null);
  const [unfunded, setUnfunded] = useState<UnfundedMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      setLoading(true);

      if (milestoneId) {
        const { data } = await supabase
          .from("milestones")
          .select("id, title, amount")
          .eq("id", milestoneId)
          .single();

        if (!cancelled) {
          setMilestone(data);
          setLoading(false);
        }
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      const rows = await getUnfundedMilestones(user.id);
      if (!cancelled) {
        setUnfunded(rows);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [milestoneId]);

  const handleFund = async () => {
    if (!milestone) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/fund-milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId: milestone.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start payment");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white h-48 animate-pulse" />;
  }

  if (!milestoneId) {
    if (unfunded.length === 0) {
      return (
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
          No unfunded milestones right now.
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
        <h3 className="text-sm font-semibold text-[#1F2A22] mb-1">
          Fund a Milestone
        </h3>
        <p className="text-xs text-[#8A8A7E] mb-5">
          Pick a milestone below to fund it via Paystack.
        </p>

        <div className="flex flex-col divide-y divide-[#EFEBE2]">
          {unfunded.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1F2A22] truncate">
                  {m.title}
                </p>
                <p className="text-xs text-[#8A8A7E] truncate">
                  {m.jobTitle} · {m.freelancerName}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-[#1F2A22]">
                  ₦{m.amount.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/employer/payments?tab=fund-milestone&milestone=${m.id}`,
                    )
                  }
                  className="rounded-full bg-[#A8531E] px-4 py-2 text-xs font-medium text-white hover:bg-[#94481A] transition-colors"
                >
                  Fund
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!milestone) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        Milestone not found.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-1">
        {milestone.title}
      </h3>
      <p className="text-2xl font-bold text-[#1F2A22] mb-6">
        ₦{Number(milestone.amount).toLocaleString()}
      </p>

      {error && <p className="text-xs text-[#C6543A] mb-3">{error}</p>}

      <button
        type="button"
        onClick={handleFund}
        disabled={submitting}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60"
      >
        {submitting ? "Redirecting…" : "Fund Milestone via Paystack"}
      </button>
    </div>
  );
}