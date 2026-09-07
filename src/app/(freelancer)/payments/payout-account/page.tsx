"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ConnectPayoutAccount from "../components/ConnectPayoutAccount";

export default function PayoutAccountPage() {
    const { t } = useLanguage();
  const router = useRouter();

  return (
    <div>
      <Link
        href="/payments"
        className="inline-flex items-center gap-1.5 text-sm text-[#8A8A7E] hover:text-[#1F2A22] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        {t("app_freelancer_payments_payout-account_page.back_to_payments")}</Link>

      <h1 className="text-2xl font-bold text-[#1F2A22] mb-1">
        {t("app_freelancer_payments_payout-account_page.connect_a_bank_account")}</h1>
      <p className="text-sm text-[#8A8A7E] mb-6">
        {t("app_freelancer_payments_payout-account_page.add_where_talentq_should_send_your_withd")}</p>

      <ConnectPayoutAccount
        onConnected={() => {
          router.push("/payments?tab=withdraw");
        }}
      />
    </div>
  );
}
