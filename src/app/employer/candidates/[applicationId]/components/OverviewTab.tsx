import { Star } from "lucide-react";
import type { CandidateDetail } from "@/lib/queries/candidate-detail";

export default function OverviewTab({
  candidate,
}: {
  candidate: CandidateDetail;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-3">Skills</h3>
          {candidate.skills.length > 0 ?
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#FBEADB] px-3 py-1.5 text-xs text-[#DE814A]"
                >
                  {skill}
                </span>
              ))}
            </div>
          : <p className="text-sm text-[#8A8A7E]">No skills listed yet.</p>}
        </div>

        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-3">
            Certifications
          </h3>
          <p className="text-sm text-[#8A8A7E]">
            Certifications aren&apos;t tracked yet.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
            Quick Stats
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A7E]">AI Match Score</span>
              <span className="font-medium text-[#1F2A22]">
                {candidate.aiScore !== null ? `${candidate.aiScore}/100` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A7E]">Reviews</span>
              <span className="font-medium text-[#1F2A22]">
                {candidate.reviews.length} review
                {candidate.reviews.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A7E]">Overall Rating</span>
              <span className="flex items-center gap-1 font-medium text-[#1F2A22]">
                {candidate.overallRating !== null ?
                  <>
                    <Star size={13} className="fill-[#DE814A] text-[#DE814A]" />
                    {candidate.overallRating.toFixed(1)}
                  </>
                : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#A8531E] px-6 py-6">
          <h3 className="text-sm font-semibold text-white mb-2">
            Ready to hire?
          </h3>
          <p className="text-xs text-white/80 mb-4">
            Set up a milestone based escrow contract via Paystack or Flutterwave
          </p>
          <button
            type="button"
            className="w-full rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#A8531E] hover:bg-[#F5F1E9] transition-colors"
          >
            Set up Escrow →
          </button>
        </div>
      </div>
    </div>
  );
}
