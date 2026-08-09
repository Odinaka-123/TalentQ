type RateItem = {
  label: string;
  value: number;
  rate: string;
  color: string;
};

const rates: RateItem[] = [
  { label: "Your Rate", value: 100, rate: "$65/hr", color: "#1F2A22" },
  { label: "Avg. Verified", value: 85, rate: "$55/hr", color: "#DE814A" },
  { label: "Avg. Unverified", value: 58, rate: "$38/hr", color: "#F2B27E" },
];

export default function RateVsMarket() {
  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-base font-semibold text-[#1F2A22]">
        Your Rate vs. Market
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-5">
        Hourly rate compared to verified and unverified freelancers in your
        category
      </p>

      <div className="flex flex-col gap-4">
        {rates.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-[#1F2A22]">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-[#1F2A22]">
                {item.rate}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#F5F1E9]">
              <div
                className="h-full rounded-full"
                style={{ width: `${item.value}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-[#DDEEE2] px-4 py-3 mt-5">
        <p className="text-xs text-[#2E6B44]">
          You earn 18% more than the average verified freelancer in your
          category. Verification is paying off!
        </p>
      </div>
    </div>
  );
}
