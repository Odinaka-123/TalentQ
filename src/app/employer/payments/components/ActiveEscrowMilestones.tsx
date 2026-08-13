import { Lock } from "lucide-react";

type Milestone = {
  title: string;
  meta: string;
  status: "Funded" | "Awaiting Review";
  amount: string;
  amountMeta: string;
};

const milestones: Milestone[] = [
  {
    title: "Milestone 2 — Frontend Sprint",
    meta: "From Henrieta Ebiuwa · Due Aug 22, 2026",
    status: "Awaiting Review",
    amount: "$1,500",
    amountMeta: "On hold",
  },
];

export default function ActiveEscrowMilestones() {
  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A] mb-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
        Active Escrow Milestones
      </h3>

      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {milestones.map((m, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DDEEE2] shrink-0">
                <Lock size={14} className="text-[#3E8E5A]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1F2A22] truncate">
                  {m.title}
                </p>
                <p className="text-xs text-[#8A8A7E] truncate">{m.meta}</p>
              </div>
            </div>

            <span className="rounded-full bg-[#DDEEE2] px-3 py-1 text-xs text-[#3E8E5A] shrink-0">
              {m.status}
            </span>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[#1F2A22]">{m.amount}</p>
              <p className="text-xs text-[#8A8A7E]">{m.amountMeta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
