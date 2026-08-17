import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function ProfileSetupPrompt() {
  return (
    <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-6 py-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-start gap-3">
        <Sparkles size={18} className="text-[#DE814A] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#1F2A22]">
            Set up your profile
          </p>
          <p className="text-xs text-[#8A8A7E] mt-0.5 max-w-sm">
            Add your rate, experience, and availability so employers know what
            you offer.
          </p>
        </div>
      </div>
      <Link
        href="/profile/setup"
        className="flex items-center gap-1.5 rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors shrink-0"
      >
        Get Started
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
