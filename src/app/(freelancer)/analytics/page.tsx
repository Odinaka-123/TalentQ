"use client";

import { useEffect, useState } from "react";
import { Star, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getFreelancerAnalytics,
  type FreelancerAnalytics,
} from "@/lib/queries/analytics";
import AnalyticsStatCard from "./components/AnalyticsStatCard";
import ProfileIntelligenceScore from "./components/ProfileIntelligenceScore";
import SkillsGapIndicator from "./components/SkillsGapIndicator";
import RateVsMarket from "./components/RateVsMarket";
import TopActions from "./components/TopActions";
import AiInsight from "./components/AiInsight";

export default function AnalyticsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FreelancerAnalytics | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const result = await getFreelancerAnalytics(user.id);
      setData(result);
      setLoading(false);
    };

    load();
  }, [supabase]);

  if (loading || !data) {
    return (
      <div className="animate-pulse">
        <div className="h-7 w-56 rounded bg-[#EDEAE1] mb-2" />
        <div className="h-4 w-64 rounded bg-[#F0ECE3] mb-6" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white px-5 py-4">
              <div className="w-9 h-9 rounded-full bg-[#EDEAE1] mb-3" />
              <div className="h-5 w-16 rounded bg-[#EDEAE1] mb-2" />
              <div className="h-3 w-20 rounded bg-[#F0ECE3] mb-1.5" />
              <div className="h-3 w-24 rounded bg-[#F0ECE3]" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 h-64"
            />
          ))}
        </div>

        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 h-48 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 h-56" />
          <div className="rounded-2xl bg-[#EDEAE1] px-6 py-6 h-56" />
        </div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnalyticsStatCard
          icon={Star}
          value={`${stats.profileScore}/100`}
          label="Profile Score"
          trend={data.tier.label}
        />
        <AnalyticsStatCard
          icon={TrendingUp}
          value={`${stats.proposalRate}%`}
          label="Proposal Rate"
          trend="Contracts won / applications sent"
        />
        <AnalyticsStatCard
          icon={Clock}
          value={
            stats.avgResponseHours != null ?
              `${stats.avgResponseHours.toFixed(1)} hrs`
            : "No data yet"
          }
          label="Avg. Response"
          trend={
            stats.avgResponseHours != null ?
              "Based on your reply history"
            : "Reply to a message to see this"
          }
        />
        <AnalyticsStatCard
          icon={RefreshCw}
          value={`${stats.clientReturnRate}%`}
          label="Client Return Rate"
          trend="Clients who hired you again"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProfileIntelligenceScore
          score={stats.profileScore}
          breakdown={data.breakdown}
          tier={data.tier}
        />
        <SkillsGapIndicator skills={data.skillsGap} />
      </div>

      <div className="mb-6">
        <RateVsMarket data={data.rateVsMarket} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopActions actions={data.topActions} />
        <AiInsight insight={data.aiInsight} />
      </div>
    </div>
  );
}
