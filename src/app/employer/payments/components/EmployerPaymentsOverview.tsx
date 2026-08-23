"use client";

import { useEffect, useState } from "react";
import { PiggyBank, Lock } from "lucide-react";
import EmployerStatCard from "./EmployerStatCard";
import ActiveEscrowMilestones from "./ActiveEscrowMilestones";
import PaymentPartners from "./PaymentPartners";
import { createClient } from "@/lib/supabase/client";
import {
  getEmployerPaymentsOverview,
  type EmployerPaymentsOverview as OverviewData,
} from "@/lib/queries/employer-payments";

export default function EmployerPaymentsOverview() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const result = await getEmployerPaymentsOverview(user.id);
      setData(result);
      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading || !data) {
    return <div className="rounded-2xl bg-white h-64 animate-pulse" />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <EmployerStatCard
          icon={PiggyBank}
          iconBg="#FBEADB"
          iconColor="#DE814A"
          value={`$${data.totalFunded.toLocaleString()}`}
          label="Total Funded"
        />
        <EmployerStatCard
          icon={Lock}
          iconBg="#DDEEE2"
          iconColor="#3E8E5A"
          value={`$${data.inEscrow.toLocaleString()}`}
          label="In Escrow"
        />
        {/* "Available Balance" card removed — no backing concept for an
            employer wallet balance exists yet. See open question about
            whether funding is meant to be per-milestone (card charged
            fresh each time) or drawn from a pre-funded balance. */}
      </div>

      <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 py-4 mb-6">
        <p className="text-sm text-[#1F2A22]">
          All fees shown at the 10% TalentQ service rate. Withdrawal
          transactions carry no additional fee.
        </p>
      </div>

      <ActiveEscrowMilestones milestones={data.activeMilestones} />
      <PaymentPartners />
    </div>
  );
}
