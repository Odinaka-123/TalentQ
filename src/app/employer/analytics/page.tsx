import { Search, Percent, Clock, RefreshCw } from "lucide-react";
import AnalyticsStatCard from "./components/AnalyticsStatCard";
import HireConversion from "./components/HireConversion";
import HiringIntelligenceScore from "./components/HiringIntelligenceScore";
import RateBenchmarks from "./components/RateBenchmarks";
import SkillsGapIndicator from "./components/SkillsGapIndicator";
import ScoreImprovement from "./components/ScoreImprovement";
import AiInsight from "./components/AiInsight";

export default function EmployerAnalyticsPage() {
  return (
    <div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnalyticsStatCard
          icon={Search}
          value="72/100"
          label="Hiring Score"
          trend="+8 this month"
        />
        <AnalyticsStatCard
          icon={Percent}
          value="40%"
          label="Hire Rate"
          trend="↑ from 25% last month"
        />
        <AnalyticsStatCard
          icon={Clock}
          value="2.4 hrs"
          label="Avg. Response"
          trend="Faster than 78% of peers"
          positive={false}
        />
        <AnalyticsStatCard
          icon={RefreshCw}
          value="67%"
          label="Talent Return Rate"
          trend="2 of 3 clients retained"
          positive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <HireConversion />
          <RateBenchmarks />
          <SkillsGapIndicator />
        </div>
        <div className="space-y-6">
          <HiringIntelligenceScore />
          <ScoreImprovement />
          <AiInsight />
        </div>
      </div>
    </div>
  );
}
