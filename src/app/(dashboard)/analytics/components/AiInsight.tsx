import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AiInsight() {
  return (
    <div className="rounded-2xl bg-[#A8531E] px-6 py-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-white" />
        <span className="text-xs font-semibold tracking-wide text-white uppercase">
          AI Insight
        </span>
      </div>

      <p className="text-sm text-white/90 flex-1">
        Freelancers with your skill set who add 2+ portfolio case studies see a
        2.3x increase in proposal acceptance within 30 days.
      </p>

      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-white mt-4 hover:underline"
      >
        Update Portfolio
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
