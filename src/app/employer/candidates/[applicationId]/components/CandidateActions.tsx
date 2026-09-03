"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateConversation } from "@/lib/queries/messages";
import type { PipelineStatus } from "@/lib/queries/candidates";
import type { CandidateDetail } from "@/lib/queries/candidate-detail";

type CandidateActionsProps = {
  candidate: CandidateDetail;
  onStatusChange: (status: PipelineStatus) => void;
};

const ADVANCE_LABEL: Partial<Record<PipelineStatus, string>> = {
  Invited: "Move to Interviewing",
  Interviewing: "Send Offer",
  "Offer Sent": "Mark as Hired",
};

const NEXT_STATUS_LABEL: Partial<Record<PipelineStatus, PipelineStatus>> = {
  Invited: "Interviewing",
  Interviewing: "Offer Sent",
  "Offer Sent": "Hired",
};

export default function CandidateActions({
  candidate,
  onStatusChange,
}: CandidateActionsProps) {
  const router = useRouter();
  const [inviting, setInviting] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyInvited = candidate.status !== "Applied";
  const advanceLabel = ADVANCE_LABEL[candidate.status];
  const nextStatus = NEXT_STATUS_LABEL[candidate.status];
  const isHired = candidate.status === "Hired";

  const handleInvite = async () => {
    setInviting(true);
    setError(null);
    try {
      const res = await fetch("/api/employer/candidates/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: candidate.applicationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't send invite");
      onStatusChange("Invited");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send invite");
    } finally {
      setInviting(false);
    }
  };

  const handleAdvance = async () => {
    if (!nextStatus) return;
    setAdvancing(true);
    setError(null);
    try {
      const res = await fetch("/api/employer/candidates/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: candidate.applicationId,
          action: "advance",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't update status");
      onStatusChange(nextStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update status");
    } finally {
      setAdvancing(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    setError(null);
    try {
      const res = await fetch("/api/employer/candidates/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: candidate.applicationId,
          action: "reject",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't reject candidate");
      router.push("/employer/candidates");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reject candidate");
      setRejecting(false);
    }
  };

  const handleMessage = async () => {
    setMessaging(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const conversationId = await getOrCreateConversation(
        user.id,
        candidate.freelancerId,
      );
      router.push(`/employer/messages?conversation=${conversationId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't open conversation",
      );
      setMessaging(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleInvite}
            disabled={inviting || alreadyInvited}
            className="flex items-center gap-2 rounded-full bg-[#A8531E] px-4 py-2 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60"
          >
            {inviting && <Loader2 size={14} className="animate-spin" />}
            {alreadyInvited ? "Invited" : "Invite for Interview"}
          </button>

          {advanceLabel && (
            <button
              type="button"
              onClick={handleAdvance}
              disabled={advancing}
              className="flex items-center gap-2 rounded-full bg-[#3E8E5A] px-4 py-2 text-sm font-medium text-white hover:bg-[#357A4D] transition-colors disabled:opacity-60"
            >
              {advancing ?
                <Loader2 size={14} className="animate-spin" />
              : <ArrowRight size={14} />}
              {advanceLabel}
            </button>
          )}

          <button
            type="button"
            onClick={handleMessage}
            disabled={messaging}
            className="flex items-center gap-2 rounded-full border border-[#DE814A] px-4 py-2 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors disabled:opacity-60"
          >
            {messaging && <Loader2 size={14} className="animate-spin" />}
            Send message
          </button>

          {!isHired && (
            <button
              type="button"
              onClick={handleReject}
              disabled={rejecting}
              className="flex items-center gap-2 rounded-full border border-[#E5E0D6] px-4 py-2 text-sm font-medium text-[#8A8A7E] hover:bg-[#F7DADA] hover:text-[#C6543A] hover:border-[#F0C4C4] transition-colors disabled:opacity-60"
            >
              {rejecting ?
                <Loader2 size={14} className="animate-spin" />
              : <X size={14} />}
              Reject
            </button>
          )}
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
