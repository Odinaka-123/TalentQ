"use client";

import { useState } from "react";
import PaymentsTabs from "./components/PaymentsTabs";
import EmployerPaymentsOverview from "./components/EmployerPaymentsOverview";
import EmployerPaymentHistory from "./components/EmployerPaymentHistory";
import FundMilestone from "./components/FundMilestone";

type Tab = "overview" | "history" | "fund-milestone";

export default function EmployerPaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div>
      <PaymentsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && <EmployerPaymentsOverview />}
      {activeTab === "history" && <EmployerPaymentHistory />}
      {activeTab === "fund-milestone" && <FundMilestone />}
    </div>
  );
}
