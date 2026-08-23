"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getCandidateDetail,
  type CandidateDetail,
} from "@/lib/queries/candidate-detail";
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
  params: { applicationId: string };
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getCandidateDetail(params.applicationId);
      setCandidate(result);
      setLoading(false);
    };
    load();
  }, [params.applicationId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 rounded-2xl bg-white mb-4" />
        <div className="h-10 rounded-2xl bg-white mb-4" />
        <div className="h-64 rounded-2xl bg-white" />
      </div>
    );
  }

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
          href="/employer/candidates"
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
      <CandidateActions
        candidate={candidate}
        onStatusChange={(status) =>
          setCandidate((prev) => (prev ? { ...prev, status } : prev))
        }
      />
      <CandidateTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && <OverviewTab candidate={candidate} />}
      {activeTab === "portfolio" && (
        <PortfolioTab items={candidate.portfolio} />
      )}
      {activeTab === "history" && <WorkHistoryTab />}
      {activeTab === "review" && <ReviewTab reviews={candidate.reviews} />}
    </div>
  );
}
