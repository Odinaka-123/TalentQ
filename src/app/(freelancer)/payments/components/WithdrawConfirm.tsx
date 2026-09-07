"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import { Wallet, Loader2 } from "lucide-react";

const WITHDRAWAL_FEE_RATE = 0.1;

type WithdrawConfirmProps = {
  amount: number;
  methodName: string;
  payoutAccountId: string;
  onBack: () => void;
  onSuccess: (reference: string) => void;
};

export default function WithdrawConfirm({
  amount,
  methodName,
  payoutAccountId,
  onBack,
  onSuccess,
}: WithdrawConfirmProps) {
    const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fee = amount * WITHDRAWAL_FEE_RATE;
  const netReceived = amount - fee;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, payoutAccountId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Withdrawal failed");
      }

      onSuccess(data.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-[#E5E0D6] bg-white px-6 py-8 flex flex-col items-center text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#A8531E] mb-4">
        <Wallet size={22} className="text-white" />
      </div>

      <h2 className="text-lg font-semibold text-[#1F2A22]">
        {t("app_freelancer_payments_components_withdraw_confirm.confirm_withdrawal")}</h2>
      <p className="text-sm text-[#8A8A7E] mt-1 mb-6">
        {t("app_freelancer_payments_components_withdraw_confirm.review_your_withdrawal_details_below")}</p>

      <div className="w-full flex flex-col gap-2">
        <div className="rounded-xl bg-[#FBF0E4] px-4 py-3 flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs text-[#8A8A7E]">{t("app_freelancer_payments_components_withdraw_confirm.amount")}</p>
            <p className="text-xs text-[#8A8A7E]">{t("app_freelancer_payments_components_withdraw_confirm.withdrawal_fee_10")}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#1F2A22]">
              ${amount.toFixed(2)}
            </p>
            <p className="text-xs text-[#C6543A]">-${fee.toFixed(2)}</p>
          </div>
        </div>

        <div className="rounded-xl bg-[#FBF0E4] px-4 py-3 flex items-center justify-between">
          <div className="text-left">
            <p className="text-sm font-semibold text-[#1F2A22]">{t("app_freelancer_payments_components_withdraw_confirm.you_receive")}</p>
            <p className="text-xs text-[#8A8A7E]">{t("app_freelancer_payments_components_withdraw_confirm.method")}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#3E8E5A]">
              ${netReceived.toFixed(2)}
            </p>
            <p className="text-xs text-[#1F2A22]">{methodName}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#8A8A7E] mt-4">
        {t("app_freelancer_payments_components_withdraw_confirm.talentq_s_10_service_fee_was_already_app")}</p>

      {error && (
        <p className="text-xs text-[#C6543A] mt-3 w-full text-left">{error}</p>
      )}

      <div className="flex items-center gap-3 mt-6 w-full">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 rounded-full border border-[#DE814A] py-2.5 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors disabled:opacity-50"
        >
          {t("app_freelancer_payments_components_withdraw_confirm.back")}</button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting}
          className="flex-1 rounded-full bg-[#A8531E] py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? "Processing…" : "Confirm Withdrawal"}
        </button>
      </div>
    </div>
  );
}
