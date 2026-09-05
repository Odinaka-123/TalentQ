"use client";

import { useState } from "react";
import { Check, Clock, Circle, Send, Loader2 } from "lucide-react";

type Milestone = {
  id: string;
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

export default function EscrowTimeline({
  groups,
  onDelivered,
}: {
  groups: ClientGroup[];
  onDelivered?: (milestoneId: string) => void;
}) {
  const [deliveringId, setDeliveringId] = useState<string | null>(null);

  const handleDeliver = async (milestoneId: string) => {
    setDeliveringId(milestoneId);
    try {
      const res = await fetch("/api/milestones/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId }),
      });
      if (!res.ok) throw new Error("Failed to mark as delivered");
      onDelivered?.(milestoneId);
    } catch (err) {
      console.error(err);
    } finally {
      setDeliveringId(null);
    }
  };

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
                const isDelivering = deliveringId === m.id;
                return (
                  <div
                    key={m.id}
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

                    {m.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleDeliver(m.id)}
                        disabled={isDelivering}
                        className="mt-2 flex items-center gap-1 rounded-full bg-[#A8531E] px-3 py-1 text-[11px] font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60"
                      >
                        {isDelivering && (
                          <Loader2 size={11} className="animate-spin" />
                        )}
                        Mark as Delivered
                      </button>
                    )}
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
