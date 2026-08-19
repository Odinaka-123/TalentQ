import { Sparkles, ArrowRight } from "lucide-react";

export default function AiInsight() {
  return (
    <div className="rounded-2xl bg-[#732700] p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-[#F5C99B]" />
          <span className="text-[11px] font-semibold tracking-wide text-[#F5C99B]">
            AI INSIGHT
          </span>
        </div>
        <p className="text-sm text-white leading-relaxed">
          Employers who post briefs with their jobs see a 2.3x increase in
          qualified applicants within 30 days.
        </p>
      </div>

      <button
        type="button"
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#732700] text-xs font-semibold px-4 py-2.5 w-full hover:bg-[#F5EEE3] transition-colors"
      >
        Post a job brief
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
