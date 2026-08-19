type WorkHistoryEntry = {
  role: string;
  company: string;
  period: string;
  description: string;
};

const workHistory: WorkHistoryEntry[] = [
  {
    role: "Senior Software Engineer",
    company: "Andela",
    period: "2022 - Present",
    description:
      "Led frontend development for a global logistics SaaS. Reduced load time by 40%.",
  },
  {
    role: "Frontend Developer",
    company: "Jumia",
    period: "2019 - 2022",
    description:
      "Built and maintained e-commerce pages serving millions of users across Africa.",
  },
];

export default function WorkHistoryTab() {
  return (
    <div className="flex flex-col gap-4">
      {workHistory.map((entry, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1F2A22]">
                {entry.role}
              </p>
              <p className="text-sm text-[#C6543A] font-medium">
                {entry.company}
              </p>
            </div>
            <p className="text-xs text-[#8A8A7E] shrink-0">{entry.period}</p>
          </div>

          <p className="text-sm text-[#5C5347] mt-2">{entry.description}</p>
        </div>
      ))}
    </div>
  );
}
