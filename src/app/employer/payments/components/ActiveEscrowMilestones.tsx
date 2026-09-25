"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Lock, Check, RotateCcw, Loader2 } from "lucide-react";
import type { ActiveMilestone } from "@/lib/queries/employer-payments";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import { createClient } from "@/lib/supabase/client";
import { approveMilestone, requestRevision } from "@/lib/mutations/milestone-review";

const statusLabel: Record<ActiveMilestone["status"], string> = {
  pending: "Awaiting Delivery",
  delivered: "Awaiting Review",
};

const NS = "app_employer_payments_components_active_escrow_milestones";

export default function ActiveEscrowMilestones({
  milestones,
  onMilestoneUpdated,
}: {
  milestones: ActiveMilestone[];
  onMilestoneUpdated: () => void;
}) {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const supabase = createClient();

  const [actingOn, setActingOn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setActingOn(id);
    setError(null);
    try {
      await approveMilestone(supabase, id);
      onMilestoneUpdated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t(`${NS}.couldnt_approve_this_milestone`),
      );
    } finally {
      setActingOn(null);
    }
  };

  const handleRevision = async (id: string) => {
    setActingOn(id);
    setError(null);
    try {
      await requestRevision(supabase, id);
      onMilestoneUpdated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t(`${NS}.couldnt_send_this_back`),
      );
    } finally {
      setActingOn(null);
    }
  };

  if (milestones.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A] mb-6">
        <h3 className="text-sm font-semibold text-[#1F2A22] mb-2">
          {t(`${NS}.active_escrow_milestones`)}
        </h3>
        <p className="text-sm text-[#8A8A7E]">
          {t(`${NS}.no_milestones_in_escrow_yet`)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A] mb-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
        {t(`${NS}.active_escrow_milestones`)}
      </h3>

      {error && <p className="text-xs text-[#C6543A] mb-3">{error}</p>}

      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-4 py-3 flex-wrap"
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
                  {t(`${NS}.from`)}
                  {m.freelancerName}
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

            {m.status === "delivered" && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleRevision(m.id)}
                  disabled={actingOn === m.id}
                  className="flex items-center gap-1.5 rounded-full border border-[#DE814A] px-3 py-1.5 text-xs font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors disabled:opacity-60"
                >
                  <RotateCcw size={12} />
                  {t(`${NS}.send_back`)}
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(m.id)}
                  disabled={actingOn === m.id}
                  className="flex items-center gap-1.5 rounded-full bg-[#A8531E] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60"
                >
                  {actingOn === m.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Check size={12} />
                  )}
                  {t(`${NS}.approve`)}
                </button>
              </div>
            )}

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[#1F2A22]">
                {formatCurrency(m.amount)}
              </p>
              <p className="text-xs text-[#8A8A7E]">{t(`${NS}.on_hold`)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}