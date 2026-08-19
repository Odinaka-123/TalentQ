"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function CandidateActions({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full bg-[#A8531E] px-4 py-2 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          Invite for Interview
        </button>
        <button
          type="button"
          onClick={() => router.push(`/employer/messages?conversation=${slug}`)}
          className="rounded-full border border-[#DE814A] px-4 py-2 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors"
        >
          Send message
        </button>
      </div>

      <button
        type="button"
        onClick={() =>
          router.push(`/employer/payments?tab=fund-milestone&candidate=${slug}`)
        }
        className="flex items-center gap-1.5 rounded-full bg-[#A8531E] px-4 py-2 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
      >
        <Lock size={14} />
        Set Up Escrow
      </button>
    </div>
  );
}
