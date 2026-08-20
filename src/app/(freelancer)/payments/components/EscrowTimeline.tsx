import { Check, Clock, Circle, Send } from "lucide-react";

type Milestone = {
  title: string;
  amount: string;
  status: "released" | "delivered" | "pending" | "upcoming";
};

type ClientGroup = {
  client: string;
  meta: string;
  milestones: Milestone[];
};

const statusStyles = {
  released: { icon: Check, bg: "#3E8E5A", label: "Released" },
  delivered: { icon: Send, bg: "#3B82F6", label: "Pending Approval" },
  pending: { icon: Clock, bg: "#DE9A3E", label: "In Escrow" },
  upcoming: { icon: Circle, bg: "#B9B4A6", label: "Upcoming" },
};

export default function EscrowTimeline({ groups }: { groups: ClientGroup[] }) {
  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-5 sm:px-6 py-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-6">
        Escrow Release Timeline
      </h3>

      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <div key={group.client}>
            <p className="text-sm font-medium text-[#1F2A22]">{group.client}</p>
            <p className="text-xs text-[#8A8A7E] mb-4">{group.meta}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {group.milestones.map((m) => {
                const style = statusStyles[m.status];
                return (
                  <div
                    key={m.title}
                    className="flex flex-col items-center text-center"
                  >
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-full mb-2"
                      style={{ backgroundColor: style.bg }}
                    >
                      <style.icon size={16} className="text-white" />
                    </div>
                    <p className="text-xs text-[#1F2A22] mb-1">{m.title}</p>
                    <p className="text-sm font-semibold text-[#1F2A22]">
                      {m.amount}
                    </p>
                    <span className="mt-1 text-[10px] uppercase tracking-wide text-[#8A8A7E]">
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
