import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import type { Candidate } from "../../data";

export default function CandidateHeader({
  candidate,
}: {
  candidate: Candidate;
}) {
  return (
    <div className="rounded-2xl border border-[#DE814A] bg-white px-6 py-5 flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-[#3E5C50] overflow-hidden shrink-0">
          <Image
            src={candidate.avatar}
            alt={candidate.name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-lg font-bold text-[#1F2A22]">{candidate.name}</h1>
          <p className="text-sm text-[#C6543A] font-medium">
            {candidate.title}
          </p>
          <p className="text-xs text-[#8A8A7E] mt-1">
            {candidate.location} · {candidate.experience} · {candidate.rate}
          </p>

          <div className="flex items-center gap-3 mt-2">
            {candidate.available && (
              <span className="flex items-center gap-1 text-xs text-[#3E8E5A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8E5A]" />
                Available
              </span>
            )}
            {candidate.identityVerified && (
              <span className="flex items-center gap-1 text-xs text-[#DE814A]">
                <ShieldCheck size={12} />
                Identity and skills verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl bg-[#A8531E] px-4 py-2.5 shrink-0">
        <span className="text-lg font-bold text-white leading-none">
          {candidate.aiScore}%
        </span>
        <span className="text-[10px] text-white/80 mt-1">AI Score</span>
      </div>
    </div>
  );
}
