type Metric = {
  label: string;
  value: number;
};

const metrics: Metric[] = [
  { label: "Identity", value: 100 },
  { label: "Skills", value: 85 },
  { label: "Portfolio", value: 40 },
  { label: "Activity", value: 72 },
  { label: "Reviews", value: 100 },
];

const SCORE = 72;
const MAX = 100;

export default function HiringIntelligenceScore() {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (SCORE / MAX) * circumference;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#1F2A22]">
          Hiring Intelligence Score
        </h3>
        <span className="text-[11px] font-medium text-[#DE814A] bg-[#FBEADB] px-2 py-1 rounded-full">
          Verified Employer
        </span>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#FBEADB"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#DE814A"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 48 48)"
          />
          <text
            x="48"
            y="52"
            textAnchor="middle"
            className="fill-[#1F2A22] font-bold"
            fontSize="22"
          >
            {SCORE}
          </text>
        </svg>
        <div>
          <p className="text-sm font-semibold text-[#1F2A22]">Good Standing</p>
          <p className="text-xs text-[#8A8A7E]">{SCORE} points to Elite tier</p>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#8A8A7E]">{m.label}</span>
              <span className="text-xs font-medium text-[#1F2A22]">
                {m.value}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#FBEADB]">
              <div
                className="h-1.5 rounded-full bg-[#732700]"
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
