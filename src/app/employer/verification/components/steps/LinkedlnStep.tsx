"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import ProgressBar from "../ProgressBar";
import { createClient } from "@/lib/supabase/client";

type LinkedInStepProps = {
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
};

type Status = "idle" | "connecting" | "error";

export default function LinkedInStep({
  totalSteps,
  onBack,
}: LinkedInStepProps) {
    const { t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");

  const handleConnect = async () => {
    setStatus("connecting");

    const supabase = createClient();
    const { error } = await supabase.auth.linkIdentity({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/employer/verification?linkedin=connected`,
      },
    });

    if (error) {
      console.error("LinkedIn link failed:", error);
      setStatus("error");
    }
    // On success, browser navigates away to LinkedIn.
  };

  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <Loader2 size={32} className="text-[#DE814A] animate-spin mb-5" />
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_employer_verification_components_steps_linkedln_step.connecting_to_linkedin")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs">
          {t("app_employer_verification_components_steps_linkedln_step.redirecting_you_to_approve_access")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="text-[#8A8A7E] hover:text-[#1F2A22]"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <ProgressBar step={2} totalSteps={totalSteps} />
        </div>
        <span className="text-xs text-[#8A8A7E] shrink-0">
          {t("app_employer_verification_components_steps_linkedln_step.step_2_of")}{totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DCE9F7] mx-auto mb-5">
        <FaLinkedin size={26} className="text-[#3E7AC7]" />
      </div>

      <h2 className="text-xl font-bold text-[#1F2A22] text-center mb-2">
        {t("app_employer_verification_components_steps_linkedln_step.connect_your_company_linkedin")}</h2>
      <p className="text-sm text-[#8A8A7E] text-center max-w-xs mx-auto mb-6">
        {t("app_employer_verification_components_steps_linkedln_step.we_ll_confirm_your_company_page_to_verif")}</p>

      {status === "error" && (
        <p className="text-sm text-[#C6543A] text-center mb-4">
          {t("app_employer_verification_components_steps_linkedln_step.couldn_t_connect_please_try_again")}</p>
      )}

      <button
        type="button"
        onClick={handleConnect}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] py-3 text-sm font-medium text-white hover:bg-[#095196] transition-colors"
      >
        <FaLinkedin size={16} />
        {t("app_employer_verification_components_steps_linkedln_step.continue_with_linkedin")}</button>
    </div>
  );
}
