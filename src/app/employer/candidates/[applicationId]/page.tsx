import { notFound } from "next/navigation";
import { getCandidateDetail } from "@/lib/queries/candidate-detail";
import CandidateHeader from "./components/CandidateHeader";
import CandidateActionsWrapper from "./components/CandidateActionsWrapper";
import CandidateDetailTabs from "./components/CandidateDetailTabs";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const candidate = await getCandidateDetail(applicationId);

  if (!candidate) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-[#1F2A22]">
      <CandidateHeader candidate={candidate} />

      <div className="mb-4">
        <CandidateActionsWrapper candidate={candidate} />
      </div>

      <CandidateDetailTabs candidate={candidate} />
    </div>
  );
}
