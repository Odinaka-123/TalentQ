import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { PipelineCandidate, PipelineStatus } from "../pipelineData";

const statusStyles: Record<PipelineStatus, { bg: string; color: string }> = {
  Applied: { bg: "#DCE9F7", color: "#3E7AC7" },
  Invited: { bg: "#FBEADB", color: "#DE814A" },
  Interviewing: { bg: "#EDE4F7", color: "#8A5FC7" },
  "Offer Sent": { bg: "#F4E3C9", color: "#B9862F" },
  Hired: { bg: "#DDEEE2", color: "#3E8E5A" },
};

export default function CandidateRow({
  candidate,
}: {
  candidate: PipelineCandidate;
}) {
  const style = statusStyles[candidate.status];

  return (
    <Link
      href={`/employer/candidates/${candidate.slug}`}
      className="flex items-center gap-4 rounded-2xl border border-[#E5E0D6] bg-white px-5 py-4 hover:border-[#DE814A] transition-colors"
    >
      <div className="w-11 h-11 rounded-full bg-[#3E5C50] overflow-hidden shrink-0">
        <Image
          src={candidate.avatar}
          alt={candidate.name}
          width={44}
          height={44}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1F2A22] truncate">
          {candidate.name}
        </p>
        <p className="text-xs text-[#8A8A7E] truncate">
          {candidate.title} · Applied to {candidate.jobTitle}
        </p>
      </div>

      <span className="hidden sm:flex items-center gap-1 rounded-full bg-[#DDEEE2] px-2.5 py-1 text-xs font-medium text-[#3E8E5A] shrink-0">
        <Sparkles size={11} />
        {candidate.aiScore}%
      </span>

      <span
        className="rounded-full px-3 py-1 text-xs font-medium shrink-0"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        {candidate.status}
      </span>

      <span className="hidden sm:block text-xs text-[#8A8A7E] shrink-0 w-24 text-right">
        {candidate.lastActivity}
      </span>
    </Link>
  );
}
