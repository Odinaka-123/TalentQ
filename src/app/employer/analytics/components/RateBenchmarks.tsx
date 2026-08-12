type RateRow = {
  label: string;
  value: number;
  display: string;
};

const rows: RateRow[] = [
  { label: "Your Rate", value: 85, display: "$85/hr" },
  { label: "Avg. Verified", value: 58, display: "$58/hr" },
  { label: "Avg. Unverified", value: 38, display: "$38/hr" },
];

const MAX = 85;

export default function RateBenchmarks() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
        Rate Benchmarks
      </h3>

      <div className="space-y-3 mb-4">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#8A8A7E]">{r.label}</span>
              <span className="text-xs font-medium text-[#1F2A22]">
                {r.display}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#FBEADB]">
              <div
                className="h-2 rounded-full bg-[#732700]"
                style={{ width: `${(r.value / MAX) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-[#E9F3EC] px-3 py-2">
        <p className="text-xs text-[#3E8E5A]">
          You pay $7/hr more than avg — attracting top verified talent. Paying
          off.
        </p>
      </div>
    </div>
  );
}
