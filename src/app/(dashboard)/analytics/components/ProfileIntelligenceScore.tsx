type BreakdownItem = {
  label: string;
  value: number;
};

const breakdown: BreakdownItem[] = [
  { label: "Identity", value: 100 },
  { label: "Skills", value: 85 },
  { label: "Portfolio", value: 40 },
  { label: "Activity", value: 75 },
  { label: "Reviews", value: 60 },
];

const score = 72;
const radius = 40;
const circumference = 2 * Math.PI * radius;
const offset = circumference - (score / 100) * circumference;

export default function ProfileIntelligenceScore() {
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
          <p className="text-sm font-semibold text-[#1F2A22]">Good Standing</p>
          <p className="text-xs text-[#8A8A7E]">28 points to Elite tier</p>
          <span className="inline-block mt-1.5 rounded-full bg-[#F2DFC8] px-2.5 py-1 text-xs text-[#A8531E]">
            moderate
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#5C5347]">{item.label}</span>
              <span className="text-xs text-[#8A8A7E]">{item.value}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#F2DFC8]">
              <div
                className="h-full rounded-full bg-[#A8531E]"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
