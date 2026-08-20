"use client";

import { useEffect, useState } from "react";
import PaymentsTabs from "./components/PaymentsTabs";
import PaymentsOverview from "./components/PaymentsOverview";
import PaymentHistory from "./components/PaymentHistory";
import Withdraw from "./components/Withdraw";
import PaymentsEmptyState from "./components/PaymentsEmptyState";
import { createClient } from "@/lib/supabase/client";
import { getVerificationStatus } from "@/lib/queries/verification";

type Tab = "overview" | "history" | "withdraw";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { status } = await getVerificationStatus(user.id);
      setIsIdentityVerified(status === "verified");
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2A22]">Payments</h1>
      <p className="text-sm text-[#8A8A7E] mb-6">
        Track your performance and growth
      </p>

      {loading ?
        <div className="rounded-2xl border border-[#E5E0D6] h-40 animate-pulse bg-white" />
      : !isIdentityVerified ?
        <PaymentsEmptyState />
      : <>
          <PaymentsTabs active={activeTab} onChange={setActiveTab} />

          {activeTab === "overview" && <PaymentsOverview />}
          {activeTab === "history" && <PaymentHistory />}
          {activeTab === "withdraw" && <Withdraw />}
        </>
      }
    </div>
  );
}
