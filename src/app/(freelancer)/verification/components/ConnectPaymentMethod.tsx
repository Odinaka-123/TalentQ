import Link from "next/link";
import { Landmark, CreditCard, Lock } from "lucide-react";

type ConnectPaymentMethodProps = {
  isIdentityVerified: boolean;
};

export default function ConnectPaymentMethod({
  isIdentityVerified,
}: ConnectPaymentMethodProps) {
  if (!isIdentityVerified) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-10 flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F1E9] mb-4">
          <Lock size={20} className="text-[#8A8A7E]" />
        </div>
        <h3 className="text-sm font-semibold text-[#1F2A22] mb-1">
          Connect a payment method
        </h3>
        <p className="text-xs text-[#8A8A7E] max-w-sm">
          Identity verification is required before you can connect a bank
          account or card and receive payments.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-1">
        Connect a payment method
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-5">
        Add a bank account or card to receive milestone payments and withdraw
        your earnings.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="flex-1 flex items-center gap-3 rounded-xl border border-[#E5E0D6] px-4 py-3.5 text-left hover:border-[#DE814A] transition-colors"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#DDEEE2] shrink-0">
            <Landmark size={16} className="text-[#3E8E5A]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#1F2A22]">Connect bank</p>
            <p className="text-xs text-[#8A8A7E]">
              Paystack, Flutterwave, or bank transfer
            </p>
          </div>
        </button>

        <button
          type="button"
          className="flex-1 flex items-center gap-3 rounded-xl border border-[#E5E0D6] px-4 py-3.5 text-left hover:border-[#DE814A] transition-colors"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FBEADB] shrink-0">
            <CreditCard size={16} className="text-[#DE814A]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#1F2A22]">Add card</p>
            <p className="text-xs text-[#8A8A7E]">
              For faster future withdrawals
            </p>
          </div>
        </button>
      </div>

      <Link
        href="/payments"
        className="inline-block text-xs text-[#C6543A] font-medium mt-4 hover:underline"
      >
        Go to Payments →
      </Link>
    </div>
  );
}
