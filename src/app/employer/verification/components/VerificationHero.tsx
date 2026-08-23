"use client";

import { Users2 } from "lucide-react";

export default function VerificationHero({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-2xl border border-[#E8A47E] bg-white px-6 py-6 mb-6">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DE814A] px-3 py-1 text-xs font-medium text-[#C6543A] mb-4">
        <Users2 size={12} />
        Talent Q Trust System
      </span>

      <h1 className="text-xl font-bold text-[#1F2A22] mb-2">
        Your credentials, finally respected.
      </h1>
      <p className="text-sm text-[#8A8A7E] max-w-2xl mb-5">
        Verified employers attract 3x more qualified applicants on TalentQ. Our
        trust layer does the hard work permanently — so top African talent can
        trust you before the first message.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
      >
        Start Verification
      </button>
    </div>
  );
}
