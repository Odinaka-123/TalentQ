"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateConversation } from "@/lib/queries/messages";
import type { PipelineStatus } from "@/lib/queries/candidates";
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
  const [messaging, setMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyInvited = candidate.status !== "Applied";

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
            onClick={handleMessage}
            disabled={messaging}
            className="flex items-center gap-2 rounded-full border border-[#DE814A] px-4 py-2 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors disabled:opacity-60"
          >
            {messaging && <Loader2 size={14} className="animate-spin" />}
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
