"use client";

import { useState } from "react";
import PaymentsTabs from "./components/PaymentsTabs";
import PaymentsOverview from "./components/PaymentsOverview";
import PaymentHistory from "./components/PaymentHistory";
import Withdraw from "./components/Withdraw";
import PaymentsEmptyState from "./components/PaymentsEmptyState";

type Tab = "overview" | "history" | "withdraw";

const isIdentityVerified = true; // TODO: replace with real verification status from backend

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2A22]">Payments</h1>
      <p className="text-sm text-[#8A8A7E] mb-6">
        Track your performance and growth
      </p>

      {!isIdentityVerified ?
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
