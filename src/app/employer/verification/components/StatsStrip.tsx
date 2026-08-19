type Stat = {
  value: string;
  label: string;
};

const stats: Stat[] = [
  { value: "3x", label: "More applicants for verified employers" },
  { value: "68%", label: "Of top talent filter for verified employers only" },
  { value: "$12", label: "Higher avg. hourly rate for verified clients" },
  { value: "2mins", label: "Median time to verification approval" },
];

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-2xl font-bold text-[#A8531E]">{stat.value}</p>
          <p className="text-xs text-[#8A8A7E] mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
