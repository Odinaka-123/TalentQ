import { Star, TrendingUp, Clock, RefreshCw } from "lucide-react";
import AnalyticsStatCard from "./components/AnalyticsStatCard";
import ProfileIntelligenceScore from "./components/ProfileIntelligenceScore";
import SkillsGapIndicator from "./components/SkillsGapIndicator";
import RateVsMarket from "./components/RateVsMarket";
import TopActions from "./components/TopActions";
import AiInsight from "./components/AiInsight";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#000000]">
        Analytics Overview
      </h1>
      <p className="text-sm text-[#8A8A7E] mb-6">
        Track your performance and growth
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnalyticsStatCard
          icon={Star}
          value="72/100"
          label="Profile Score"
          trend="+8 this month"
        />
        <AnalyticsStatCard
          icon={TrendingUp}
          value="40%"
          label="Proposal Rate"
          trend="1 from 25% last month"
        />
        <AnalyticsStatCard
          icon={Clock}
          value="2.4 hrs"
          label="Avg. Response"
          trend="Faster than 78% of peers"
        />
        <AnalyticsStatCard
          icon={RefreshCw}
          value="67%"
          label="Client Return Rate"
          trend="2 of 3 clients retired"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProfileIntelligenceScore />
        <SkillsGapIndicator />
      </div>

      <div className="mb-6">
        <RateVsMarket />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopActions />
        <AiInsight />
      </div>
    </div>
  );
}
