"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import PaymentsTabs from "./components/PaymentsTabs";
import EmployerPaymentsOverview from "./components/EmployerPaymentsOverview";
import EmployerPaymentHistory from "./components/EmployerPaymentHistory";
import FundMilestone from "./components/FundMilestone";
import SetupEscrow from "./components/SetupEscrow";

type Tab = "overview" | "history" | "fund-milestone" | "setup-escrow";

const VALID_TABS: Tab[] = [
  "overview",
  "history",
  "fund-milestone",
  "setup-escrow",
];

function EmployerPaymentsContent() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as Tab | null;
  const initialTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "overview";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [prevTabFromUrl, setPrevTabFromUrl] = useState(tabFromUrl);

  if (tabFromUrl !== prevTabFromUrl) {
    setPrevTabFromUrl(tabFromUrl);
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }

  return (
    <div>
      <PaymentsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && <EmployerPaymentsOverview />}
      {activeTab === "history" && <EmployerPaymentHistory />}
      {activeTab === "setup-escrow" && <SetupEscrow />}
      {activeTab === "fund-milestone" && <FundMilestone />}
    </div>
  );
}

export default function EmployerPaymentsPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <EmployerPaymentsContent />
    </Suspense>
  );
}
