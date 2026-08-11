import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NextStepBanner() {
  return (
    <div className="rounded-2xl border border-[#E8A47E] bg-[#FBEADB] px-5 sm:px-6 py-5 flex items-center justify-between flex-wrap gap-4">
      <div>
        <p className="text-sm font-semibold text-[#1F2A22]">
          You&apos;re 1 step away from full verification
        </p>
        <p className="text-xs text-[#8A8A7E] mt-0.5 max-w-lg">
          Complete your client review badge to unlock Elite status and priority
          job matching.
        </p>
      </div>
      <Link
        href="/find-jobs"
        className="flex items-center gap-1.5 rounded-full border border-[#DE814A] bg-white px-5 py-2.5 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors shrink-0"
      >
        Find a Job
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
