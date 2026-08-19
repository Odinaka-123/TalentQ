import { Award } from "lucide-react";

export default function FirstHireBanner() {
  return (
    <div className="rounded-2xl border border-[#E8A47E] bg-[#FBEADB] px-5 py-4 flex items-start gap-3 mb-6">
      <Award size={18} className="text-[#DE814A] shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-[#1F2A22]">
          First-hire opportunities
        </p>
        <p className="text-xs text-[#8A8A7E] mt-0.5">
          No previous hires required · Quick to onboard
        </p>
      </div>
    </div>
  );
}
