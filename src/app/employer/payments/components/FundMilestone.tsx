"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type MilestoneInfo = {
  id: string;
  title: string;
  amount: number;
};

export default function FundMilestone() {
  const params = useSearchParams();
  const milestoneId = params.get("milestone");

  const [milestone, setMilestone] = useState<MilestoneInfo | null>(null);
  const [loading, setLoading] = useState(() => Boolean(milestoneId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!milestoneId) return;

    const supabase = createClient();
    supabase
      .from("milestones")
      .select("id, title, amount")
      .eq("id", milestoneId)
      .single()
      .then(({ data }) => {
        setMilestone(data);
        setLoading(false);
      });
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

  if (!milestone) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        No milestone selected to fund.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-1">
        {milestone.title}
      </h3>
      <p className="text-2xl font-bold text-[#1F2A22] mb-6">
        ${Number(milestone.amount).toLocaleString()}
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
