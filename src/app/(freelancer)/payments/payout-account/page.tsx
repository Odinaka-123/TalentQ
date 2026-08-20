"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ConnectPayoutAccount from "../components/ConnectPayoutAccount";

export default function PayoutAccountPage() {
  const router = useRouter();

  return (
    <div>
      <Link
        href="/payments"
        className="inline-flex items-center gap-1.5 text-sm text-[#8A8A7E] hover:text-[#1F2A22] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Payments
      </Link>

      <h1 className="text-2xl font-bold text-[#1F2A22] mb-1">
        Connect a bank account
      </h1>
      <p className="text-sm text-[#8A8A7E] mb-6">
        Add where TalentQ should send your withdrawals.
      </p>

      <ConnectPayoutAccount
        onConnected={() => {
          router.push("/payments?tab=withdraw");
        }}
      />
    </div>
  );
}
