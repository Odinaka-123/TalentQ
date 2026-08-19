import type { ScoreBreakdown } from "@/lib/queries/analytics";

type Props = {
  score: number;
  breakdown: ScoreBreakdown;
  tier: {
    label: string;
    badge: "low" | "moderate" | "strong" | "elite";
    pointsToNextTier: number;
  };
};

const breakdownLabels: { key: keyof ScoreBreakdown; label: string }[] = [
  { key: "identity", label: "Identity" },
  { key: "skills", label: "Skills" },
  { key: "portfolio", label: "Portfolio" },
  { key: "activity", label: "Activity" },
  { key: "reviews", label: "Reviews" },
];

const badgeStyles: Record<Props["tier"]["badge"], { bg: string; fg: string }> =
  {
    low: { bg: "#FBE9E5", fg: "#C6543A" },
    moderate: { bg: "#F2DFC8", fg: "#A8531E" },
    strong: { bg: "#DDEEE2", fg: "#2E6B44" },
    elite: { bg: "#E8E0FB", fg: "#5F3EC7" },
  };

const radius = 40;
const circumference = 2 * Math.PI * radius;

export default function ProfileIntelligenceScore({
  score,
  breakdown,
  tier,
}: Props) {
  const offset = circumference - (score / 100) * circumference;
  const badgeStyle = badgeStyles[tier.badge];

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <div className="flex items-center gap-5 mb-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#F2DFC8"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#A8531E"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#1F2A22]">{score}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#1F2A22]">{tier.label}</p>
          <p className="text-xs text-[#8A8A7E]">
            {tier.pointsToNextTier > 0 ?
              `${tier.pointsToNextTier} points to next tier`
            : "Top tier reached"}
          </p>
          <span
            className="inline-block mt-1.5 rounded-full px-2.5 py-1 text-xs"
            style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.fg }}
          >
            {tier.badge}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {breakdownLabels.map(({ key, label }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#5C5347]">{label}</span>
              <span className="text-xs text-[#8A8A7E]">{breakdown[key]}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#F2DFC8]">
              <div
                className="h-full rounded-full bg-[#A8531E]"
                style={{ width: `${breakdown[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
