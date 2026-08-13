"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { candidates } from "../data";
import CandidateHeader from "./components/CandidateHeader";
import CandidateActions from "./components/CandidateActions";
import CandidateTabs from "./components/CandidateTabs";
import OverviewTab from "./components/OverviewTab";
import PortfolioTab from "./components/PortfolioTab";
import WorkHistoryTab from "./components/WorkHistoryTab";
import ReviewTab from "./components/ReviewTab";

type Tab = "overview" | "portfolio" | "history" | "review";

export default function CandidateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const candidate = candidates[params.slug];

  if (!candidate) {
    return (
      <div className="text-center py-16 text-sm text-[#8A8A7E]">
        Candidate not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Link
          href="/employer/find-talent"
          className="inline-flex items-center gap-1.5 text-xs text-[#C6543A] font-medium hover:underline"
        >
          <ArrowLeft size={12} />
          Back to Search
        </Link>

        {activeTab !== "overview" && (
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-1.5 rounded-full border border-[#E5E0D6] px-3.5 py-1.5 text-xs font-medium text-[#1F2A22] hover:bg-[#F5F1E9] transition-colors"
          >
            View Quick Stats
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      <CandidateHeader candidate={candidate} />
      <CandidateActions slug={candidate.slug} />
      <CandidateTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && <OverviewTab candidate={candidate} />}
      {activeTab === "portfolio" && <PortfolioTab />}
      {activeTab === "history" && <WorkHistoryTab />}
      {activeTab === "review" && <ReviewTab />}
    </div>
  );
}
