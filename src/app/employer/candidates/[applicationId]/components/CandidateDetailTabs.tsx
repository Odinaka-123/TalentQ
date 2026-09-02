"use client";

import { useState } from "react";
import type { CandidateDetail } from "@/lib/queries/candidate-detail";
import CandidateTabs from "./CandidateTabs";
import OverviewTab from "./OverviewTab";
import PortfolioTab from "./PortfolioTab";
import WorkHistoryTab from "./WorkHistoryTab";
import ReviewTab from "./ReviewTab";

type Tab = "overview" | "portfolio" | "history" | "review";

export default function CandidateDetailTabs({
  candidate,
}: {
  candidate: CandidateDetail;
}) {
  const [active, setActive] = useState<Tab>("overview");

  return (
    <div>
      <CandidateTabs active={active} onChange={setActive} />

      {active === "overview" && <OverviewTab candidate={candidate} />}
      {active === "portfolio" && <PortfolioTab items={candidate.portfolio} />}
      {active === "history" && <WorkHistoryTab />}
      {active === "review" && <ReviewTab reviews={candidate.reviews} />}
    </div>
  );
}
