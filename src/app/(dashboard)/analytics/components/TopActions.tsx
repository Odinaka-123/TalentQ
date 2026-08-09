type Action = {
  label: string;
  meta: string;
  impact: string;
  dotColor: string;
};

const actions: Action[] = [
  {
    label: "Add 2 portfolio case studies",
    meta: "Profile",
    impact: "+15pts",
    dotColor: "#C6543A",
  },
  {
    label: "Complete AWS Skills assessment",
    meta: "Skills",
    impact: "+12pts",
    dotColor: "#3E7AC7",
  },
  {
    label: "Earn first client review",
    meta: "Trust",
    impact: "+10pts",
    dotColor: "#3E8E5A",
  },
  {
    label: "Improve proposal response time",
    meta: "Profile",
    impact: "+6pts",
    dotColor: "#8A5FC7",
  },
];

export default function TopActions() {
  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#1F2A22]">
          Top Actions to Improve
        </h3>
        <span className="text-xs text-[#8A8A7E]">Ranked by impact</span>
      </div>

      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {actions.map((action, i) => (
          <div
            key={action.label}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-medium shrink-0"
                style={{ backgroundColor: action.dotColor }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm text-[#1F2A22]">{action.label}</p>
                <p className="text-xs text-[#8A8A7E]">{action.meta}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-[#3E8E5A] shrink-0">
              {action.impact}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
