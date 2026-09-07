"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function FundCallbackContent() {
    const { t } = useLanguage();
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference");

  const [state, setState] = useState<"verifying" | "success" | "failed">(() =>
    reference ? "verifying" : "failed",
  );

  useEffect(() => {
    if (!reference) return;

    fetch("/api/payments/verify-funding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then((res) => res.json())
      .then((data) => setState(data.success ? "success" : "failed"))
      .catch(() => setState("failed"));
  }, [reference]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {state === "verifying" && (
        <>
          <Loader2 size={28} className="animate-spin text-[#DE814A] mb-3" />
          <p className="text-sm text-[#8A8A7E]">{t("app_employer_payments_fund-callback_page.confirming_your_payment")}</p>
        </>
      )}
      {state === "success" && (
        <>
          <CheckCircle2 size={28} className="text-[#3E8E5A] mb-3" />
          <p className="text-sm font-medium text-[#1F2A22] mb-4">
            {t("app_employer_payments_fund-callback_page.milestone_funded_successfully")}</p>
          <button
            onClick={() => router.push("/employer/payments")}
            className="rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white"
          >
            {t("app_employer_payments_fund-callback_page.back_to_payments")}</button>
        </>
      )}
      {state === "failed" && (
        <>
          <XCircle size={28} className="text-[#C6543A] mb-3" />
          <p className="text-sm font-medium text-[#1F2A22] mb-4">
            {t("app_employer_payments_fund-callback_page.we_couldn_t_confirm_this_payment")}</p>
          <button
            onClick={() => router.push("/employer/payments")}
            className="rounded-full border border-[#DE814A] px-5 py-2.5 text-sm font-medium text-[#C6543A]"
          >
            {t("app_employer_payments_fund-callback_page.back_to_payments")}</button>
        </>
      )}
    </div>
  );
}

export default function FundCallbackPage() {
    const { t } = useLanguage();
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 size={28} className="animate-spin text-[#DE814A] mb-3" />
          <p className="text-sm text-[#8A8A7E]">{t("app_employer_payments_fund-callback_page.loading")}</p>
        </div>
      }
    >
      <FundCallbackContent />
    </Suspense>
  );
}
