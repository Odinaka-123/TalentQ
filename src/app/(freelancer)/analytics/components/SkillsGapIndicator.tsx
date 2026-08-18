import type { SkillDemand } from "@/lib/queries/analytics";

type Props = {
  skills: SkillDemand[];
};

export default function SkillsGapIndicator({ skills }: Props) {
  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-base font-semibold text-[#1F2A22]">
        Skills Gap Indicator
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-4">
        Most in-demand skills across open jobs right now
      </p>

      {skills.length === 0 ?
        <p className="text-sm text-[#8A8A7E] py-4">
          Not enough open jobs yet to show demand trends.
        </p>
      : <div className="flex flex-col gap-3">
          {skills.map((item) => (
            <div key={item.skill} className="flex items-center gap-3">
              <span className="text-xs text-[#5C5347] w-20 shrink-0 truncate">
                {item.skill}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-[#F2DFC8]">
                <div
                  className="h-full rounded-full bg-[#A8531E]"
                  style={{ width: `${item.demand}%` }}
                />
              </div>
              <span className="text-xs font-medium w-10 text-right shrink-0 text-[#A8531E]">
                {item.demand}%
              </span>
            </div>
          ))}
        </div>
      }

      <div className="flex items-center gap-1.5 mt-4 text-xs text-[#8A8A7E]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#A8531E]" />% of open jobs
        requiring this skill
      </div>
    </div>
  );
}
