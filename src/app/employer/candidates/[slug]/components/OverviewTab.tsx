import { Award, Star } from "lucide-react";
import type { Candidate } from "../../data";

export default function OverviewTab({ candidate }: { candidate: Candidate }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-2">About</h3>
          <p className="text-sm text-[#5C5347]">{candidate.about}</p>
        </div>

        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-3">Skills</h3>
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
        </div>

        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-3">
            Certifications
          </h3>
          <div className="flex flex-col gap-4">
            {candidate.certifications.map((cert) => (
              <div key={cert.title} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FBEADB] shrink-0">
                  <Award size={16} className="text-[#DE814A]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1F2A22]">
                    {cert.title}
                  </p>
                  <p className="text-xs text-[#8A8A7E]">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
            Quick Stats
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A7E]">Hourly Rate</span>
              <span className="font-medium text-[#1F2A22]">
                {candidate.quickStats.hourlyRate}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A7E]">Experience</span>
              <span className="font-medium text-[#1F2A22]">
                {candidate.quickStats.experience}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A7E]">AI Match Score</span>
              <span className="font-medium text-[#1F2A22]">
                {candidate.quickStats.aiMatchScore}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A7E]">Reviews</span>
              <span className="font-medium text-[#1F2A22]">
                {candidate.quickStats.reviews}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A7E]">Overall Rating</span>
              <span className="flex items-center gap-1 font-medium text-[#1F2A22]">
                <Star size={13} className="fill-[#DE814A] text-[#DE814A]" />
                {candidate.quickStats.overallRating}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
            Rating Breakdown
          </h3>
          <div className="flex flex-col gap-3">
            {candidate.ratingBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#5C5347]">{item.label}</span>
                  <span className="text-xs text-[#8A8A7E]">{item.value}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EFEBE2]">
                  <div
                    className="h-full rounded-full bg-[#A8531E]"
                    style={{ width: `${(item.value / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
