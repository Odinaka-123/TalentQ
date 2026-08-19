import Link from "next/link";
import { ShieldAlert, CreditCard, Landmark } from "lucide-react";

export default function PaymentsEmptyState() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[#E8C9A8] bg-[#FBF0E4] px-5 py-4 flex items-center gap-3">
        <ShieldAlert size={18} className="text-[#C6543A] shrink-0" />
        <p className="text-sm text-[#1F2A22]">
          Verify your identity to unlock payments — this keeps every transaction
          on TalentQ safe for both sides.
        </p>
        <Link
          href="/verification"
          className="ml-auto shrink-0 rounded-full bg-[#C6543A] px-4 py-2 text-xs font-medium text-white hover:bg-[#B04A32] transition-colors"
        >
          Verify identity
        </Link>
      </div>

      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#F5F1E9] mb-5">
          <Landmark size={24} className="text-[#8A8A7E]" />
        </div>
        <h3 className="text-base font-semibold text-[#1F2A22] mb-2">
          No payment method connected yet
        </h3>
        <p className="text-sm text-[#8A8A7E] max-w-sm mb-6">
          Once you&apos;re verified, connect a bank account or card to receive
          milestone payments and withdraw your earnings.
        </p>
        <div className="flex items-center gap-3">
          <button
            disabled
            className="flex items-center gap-2 rounded-full border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#B9B4A6] cursor-not-allowed"
          >
            <Landmark size={16} />
            Connect bank
          </button>
          <button
            disabled
            className="flex items-center gap-2 rounded-full border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#B9B4A6] cursor-not-allowed"
          >
            <CreditCard size={16} />
            Add card
          </button>
        </div>
      </div>
    </div>
  );
}
