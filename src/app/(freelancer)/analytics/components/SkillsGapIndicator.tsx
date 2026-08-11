type SkillGap = {
  skill: string;
  fill: number;
  delta: number;
};

const skills: SkillGap[] = [
  { skill: "GraphQL", fill: 30, delta: -3 },
  { skill: "AWS", fill: 55, delta: -5 },
  { skill: "Docker", fill: 25, delta: -8 },
  { skill: "React", fill: 75, delta: 3 },
  { skill: "TypeScript", fill: 65, delta: 2 },
];

export default function SkillsGapIndicator() {
  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-base font-semibold text-[#1F2A22]">
        Skills Gap Indicator
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-4">
        Your proficiency vs. what top-paying jobs demand
      </p>

      <div className="flex flex-col gap-3">
        {skills.map((item) => {
          const isPositive = item.delta > 0;
          return (
            <div key={item.skill} className="flex items-center gap-3">
              <span className="text-xs text-[#5C5347] w-16 shrink-0">
                {item.skill}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-[#F2DFC8]">
                <div
                  className={`h-full rounded-full ${
                    isPositive ? "bg-[#3E8E5A]" : "bg-[#A8531E]"
                  }`}
                  style={{ width: `${item.fill}%` }}
                />
              </div>
              <span
                className={`text-xs font-medium w-9 text-right shrink-0 ${
                  isPositive ? "text-[#3E8E5A]" : "text-[#C6543A]"
                }`}
              >
                {isPositive ? "+" : ""}
                {item.delta}pts
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-[#8A8A7E]">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A8531E]" /> You
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2DFC8]" /> Market
          demand
        </span>
      </div>
    </div>
  );
}
