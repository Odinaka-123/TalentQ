import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

type PostJobSuccessProps = {
  onPostAnother: () => void;
};

export default function PostJobSuccess({ onPostAnother }: PostJobSuccessProps) {
  return (
    <div className="flex flex-col items-center text-center py-16">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#DDEEE2] mb-6">
        <Check size={28} className="text-[#3E8E5A]" />
      </div>

      <h2 className="text-xl font-bold text-[#1F2A22] mb-2">
        Job Posted Successfully!
      </h2>
      <p className="text-sm text-[#8A8A7E] max-w-sm mb-8">
        Your job is live. Our AI is already matching verified African
        professionals to your role.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPostAnother}
          className="rounded-full border border-[#E5E0D6] px-5 py-2.5 text-sm font-medium text-[#1F2A22] hover:bg-[#F5F1E9] transition-colors"
        >
          Post Another
        </button>
        <Link
          href="/employer/candidates"
          className="flex items-center gap-2 rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          View Matching Talent
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}