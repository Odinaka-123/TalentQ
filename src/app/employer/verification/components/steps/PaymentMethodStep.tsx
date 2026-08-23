import { ArrowLeft, Wallet } from "lucide-react";

export default function PaymentMethodStep({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="text-[#8A8A7E] hover:text-[#1F2A22] mb-6"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F2DFC8] mx-auto mb-5">
        <Wallet size={26} className="text-[#DE814A]" />
      </div>

      <h2 className="text-xl font-bold text-[#1F2A22] text-center mb-2">
        Payment Method
      </h2>
      <p className="text-sm text-[#8A8A7E] text-center max-w-xs mx-auto">
        Connecting Paystack or Flutterwave is coming soon. We&apos;ll notify you
        once escrow funding is available.
      </p>
    </div>
  );
}
