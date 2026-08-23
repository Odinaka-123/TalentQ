import Image from "next/image";
import { ShieldCheck, User } from "lucide-react";
import type { CandidateDetail } from "@/lib/queries/candidate-detail";

export default function CandidateHeader({
  candidate,
}: {
  candidate: CandidateDetail;
}) {
  return (
    <div className="rounded-2xl border border-[#DE814A] bg-white px-6 py-5 flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-[#3E5C50] overflow-hidden shrink-0 relative flex items-center justify-center">
          {candidate.avatarUrl ?
            <Image
              src={candidate.avatarUrl}
              alt={candidate.name}
              fill
              className="object-cover"
            />
          : <User size={22} className="text-white/70" />}
        </div>

        <div>
          <h1 className="text-lg font-bold text-[#1F2A22]">{candidate.name}</h1>
          <p className="text-sm text-[#C6543A] font-medium">
            {candidate.headline}
          </p>

          <div className="flex items-center gap-3 mt-2">
            {candidate.identityVerified && (
              <span className="flex items-center gap-1 text-xs text-[#DE814A]">
                <ShieldCheck size={12} />
                Identity and skills verified
              </span>
            )}
          </div>
        </div>
      </div>

      {candidate.aiScore !== null && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-[#A8531E] px-4 py-2.5 shrink-0">
          <span className="text-lg font-bold text-white leading-none">
            {candidate.aiScore}%
          </span>
          <span className="text-[10px] text-white/80 mt-1">AI Score</span>
        </div>
      )}
    </div>
  );
}
