import { Sparkles } from "lucide-react";

type PreviewStepProps = {
  title: string;
  workArrangement: string;
  jobType: string;
  department: string;
  minBudget: string;
  maxBudget: string;
  currency: string;
  skills: string[];
  description: string;
};

export default function PreviewStep({
  title,
  workArrangement,
  jobType,
  department,
  minBudget,
  maxBudget,
  currency,
  skills,
  description,
}: PreviewStepProps) {
  const currencySymbol = currency === "USD" ? "$" : currency + " ";

  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <h2 className="text-base font-semibold text-[#1F2A22] mb-5">
        Preview & Post
      </h2>

      <div className="rounded-2xl border border-[#F2DFC8] bg-[#FBF3EA] px-6 py-5 mb-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg font-bold text-[#1F2A22]">
            {title || "Job Title"}
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A8531E] px-3 py-1 text-xs font-medium text-white shrink-0">
            <Sparkles size={12} />
            AI Matching On
          </span>
        </div>

        <p className="text-xs text-[#8A8A7E] mb-3">
          {workArrangement} · {jobType} · {department}
          {department ? " · " : ""}
          {currencySymbol}
          {minBudget || "0"}-{currencySymbol}
          {maxBudget || "0"}/mo
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#F2DFC8] px-3 py-1 text-xs text-[#A8531E]"
            >
              {skill}
            </span>
          ))}
        </div>

        <p className="text-sm text-[#5C5347]">
          {description || "Your job description will appear here..."}
        </p>
      </div>

      <div className="rounded-xl bg-[#F2DFC8] px-4 py-3 flex items-center gap-2">
        <Sparkles size={14} className="text-[#A8531E] shrink-0" />
        <p className="text-xs text-[#A8531E]">
          AI matching begins immediately — expect first recommendation
          within 24 hours.
        </p>
      </div>
    </div>
  );
}