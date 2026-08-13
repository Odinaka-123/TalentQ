import { pipelineCandidates } from "../pipelineData";

const stages: { label: string; status: string; color: string }[] = [
  { label: "Applied", status: "Applied", color: "#3E7AC7" },
  { label: "Invited", status: "Invited", color: "#DE814A" },
  { label: "Interviewing", status: "Interviewing", color: "#8A5FC7" },
  { label: "Offer Sent", status: "Offer Sent", color: "#B9862F" },
  { label: "Hired", status: "Hired", color: "#3E8E5A" },
];

export default function PipelineStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
      {stages.map((stage) => {
        const count = pipelineCandidates.filter(
          (c) => c.status === stage.status,
        ).length;
        return (
          <div
            key={stage.label}
            className="rounded-2xl border border-[#E5E0D6] bg-white px-4 py-4 text-center"
          >
            <p className="text-xl font-bold" style={{ color: stage.color }}>
              {count}
            </p>
            <p className="text-xs text-[#8A8A7E] mt-0.5">{stage.label}</p>
          </div>
        );
      })}
    </div>
  );
}
