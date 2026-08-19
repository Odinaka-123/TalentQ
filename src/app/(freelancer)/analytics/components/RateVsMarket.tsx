import type { RateComparison } from "@/lib/queries/analytics";

type Props = {
  data: RateComparison;
};

export default function RateVsMarket({ data }: Props) {
  const { category, yourRate, avgVerified, avgUnverified } = data;

  const values = [yourRate, avgVerified, avgUnverified].filter(
    (v): v is number => v != null,
  );
  const max = values.length > 0 ? Math.max(...values) : 1;

  const rows = [
    { label: "Your Rate", value: yourRate, color: "#1F2A22" },
    { label: "Avg. Verified", value: avgVerified, color: "#DE814A" },
    { label: "Avg. Unverified", value: avgUnverified, color: "#F2B27E" },
  ];

  const comparisonNote = (() => {
    if (yourRate == null || avgVerified == null) return null;
    const diff = Math.round(((yourRate - avgVerified) / avgVerified) * 100);
    if (diff > 0) {
      return `You earn ${diff}% more than the average verified freelancer${category ? ` in ${category}` : ""}. Nice work!`;
    }
    if (diff < 0) {
      return `You earn ${Math.abs(diff)}% less than the average verified freelancer${category ? ` in ${category}` : ""}.`;
    }
    return `Your rate matches the average verified freelancer${category ? ` in ${category}` : ""}.`;
  })();

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-base font-semibold text-[#1F2A22]">
        Your Rate vs. Market
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-5">
        {category ?
          `Hourly rate compared to other freelancers in ${category}`
        : "Add skills to your profile to compare against your category"}
      </p>

      <div className="flex flex-col gap-4">
        {rows.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-[#1F2A22]">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-[#1F2A22]">
                {item.value != null ? `$${item.value}/hr` : "No data yet"}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#F5F1E9]">
              <div
                className="h-full rounded-full"
                style={{
                  width:
                    item.value != null ? `${(item.value / max) * 100}%` : "0%",
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {comparisonNote && (
        <div className="rounded-xl bg-[#DDEEE2] px-4 py-3 mt-5">
          <p className="text-xs text-[#2E6B44]">{comparisonNote}</p>
        </div>
      )}
    </div>
  );
}
