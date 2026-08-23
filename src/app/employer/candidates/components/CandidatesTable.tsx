import type { PipelineCandidate } from "@/lib/queries/candidates";
import CandidateRow from "./CandidateRow";

export default function CandidatesTable({
  candidates,
}: {
  candidates: PipelineCandidate[];
}) {
  if (candidates.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        No candidates in this stage yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {candidates.map((candidate) => (
        <CandidateRow key={candidate.applicationId} candidate={candidate} />
      ))}
    </div>
  );
}
