type SkillRow = {
  label: string;
  proficiency: number;
  delta: number;
};

const skills: SkillRow[] = [
  { label: "GraphQL", proficiency: 70, delta: -3 },
  { label: "AWS", proficiency: 60, delta: -7 },
  { label: "Docker", proficiency: 45, delta: -8 },
  { label: "React", proficiency: 90, delta: 2 },
  { label: "TypeScript", proficiency: 95, delta: 8 },
];

export default function SkillsGapIndicator() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-1">
        Skills Gap Indicator
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-4">
        Your proficiency vs. what top-paying job demand
      </p>

      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="text-xs text-[#1F2A22] w-20 shrink-0">
              {s.label}
            </span>
            <div className="flex-1 h-2 rounded-full bg-[#FBEADB]">
              <div
                className="h-2 rounded-full bg-[#732700]"
                style={{ width: `${s.proficiency}%` }}
              />
            </div>
            <span
              className={`text-xs font-medium w-9 text-right ${
                s.delta < 0 ? "text-[#C6543A]" : "text-[#3E8E5A]"
              }`}
            >
              {s.delta > 0 ? "+" : ""}
              {s.delta}pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
