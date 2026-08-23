"use client";

import { useRouter } from "next/navigation";
import CandidateActions from "./CandidateActions";
import type { CandidateDetail } from "@/lib/queries/candidate-detail";

export default function CandidateActionsWrapper({
  candidate,
}: {
  candidate: CandidateDetail;
}) {
  const router = useRouter();

  return (
    <CandidateActions
      candidate={candidate}
      onStatusChange={() => router.refresh()}
    />
  );
}
