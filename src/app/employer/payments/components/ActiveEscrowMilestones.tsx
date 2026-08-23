import { Lock } from "lucide-react";
import type { ActiveMilestone } from "@/lib/queries/employer-payments";

const statusLabel: Record<ActiveMilestone["status"], string> = {
  pending: "Awaiting Delivery",
  delivered: "Awaiting Review",
};

export default function ActiveEscrowMilestones({
  milestones,
}: {
  milestones: ActiveMilestone[];
}) {
  if (milestones.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A] mb-6">
        <h3 className="text-sm font-semibold text-[#1F2A22] mb-2">
          Active Escrow Milestones
        </h3>
        <p className="text-sm text-[#8A8A7E]">No milestones in escrow yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A] mb-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
        Active Escrow Milestones
      </h3>

      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DDEEE2] shrink-0">
                <Lock size={14} className="text-[#3E8E5A]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1F2A22] truncate">
                  {m.title}
                </p>
                <p className="text-xs text-[#8A8A7E] truncate">
                  From {m.freelancerName}
                  {m.dueDate &&
                    ` · Due ${new Date(m.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#DDEEE2] px-3 py-1 text-xs text-[#3E8E5A] shrink-0">
              {statusLabel[m.status]}
            </span>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[#1F2A22]">
                ${m.amount.toLocaleString()}
              </p>
              <p className="text-xs text-[#8A8A7E]">On hold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
