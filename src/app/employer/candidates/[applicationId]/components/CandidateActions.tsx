"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import {
  updateApplicationStatus,
  type PipelineStatus,
} from "@/lib/queries/candidates";
import type { CandidateDetail } from "@/lib/queries/candidate-detail";

type CandidateActionsProps = {
  candidate: CandidateDetail;
  onStatusChange: (status: PipelineStatus) => void;
};

export default function CandidateActions({
  candidate,
  onStatusChange,
}: CandidateActionsProps) {
  const router = useRouter();
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyInvited = candidate.status !== "Applied";

  const handleInvite = async () => {
    setInviting(true);
    setError(null);
    try {
      await updateApplicationStatus(candidate.applicationId, "Invited");
      onStatusChange("Invited");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send invite");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInvite}
            disabled={inviting || alreadyInvited}
            className="flex items-center gap-2 rounded-full bg-[#A8531E] px-4 py-2 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60"
          >
            {inviting && <Loader2 size={14} className="animate-spin" />}
            {alreadyInvited ? "Invited" : "Invite for Interview"}
          </button>
          <button
            type="button"
            onClick={() =>
              router.push(
                `/employer/messages?conversation=${candidate.freelancerId}`,
              )
            }
            className="rounded-full border border-[#DE814A] px-4 py-2 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors"
          >
            Send message
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/employer/payments?tab=setup-escrow&candidate=${candidate.applicationId}`,
            )
          }
          className="flex items-center gap-1.5 rounded-full bg-[#A8531E] px-4 py-2 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          <Lock size={14} />
          Set Up Escrow
        </button>
      </div>
      {error && <p className="text-xs text-[#C6543A] mt-2">{error}</p>}
    </div>
  );
}
