"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import ProgressBar from "../ProgressBar";
import { createClient } from "@/lib/supabase/client";

type LinkedInConnectStepProps = {
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
};

type Status = "idle" | "connecting" | "error" | "submitted";

const permissions = [
  "Your name and profile photo",
  "Your headline and current position",
  "Profile completeness (used to assess authenticity)",
];

export default function LinkedInConnectStep({
  totalSteps,
  onBack,
  onContinue,
}: LinkedInConnectStepProps) {
    const { t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");

  const handleConnect = async () => {
    setStatus("connecting");

    const supabase = createClient();
    const { error } = await supabase.auth.linkIdentity({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/verification?linkedin=connected`,
      },
    });

    if (error) {
      console.error("LinkedIn link failed:", error);
      setStatus("error");
      return;
    }

    // On success the browser navigates away to LinkedIn immediately, so
    // nothing after this point actually runs — the "connecting" view stays
    // up until that navigation happens. The user lands back on
    // /verification?linkedin=connected once they approve, which
    // VerificationHero handles (submits the profile + refreshes status).
  };

  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <Loader2 size={32} className="text-[#DE814A] animate-spin mb-5" />
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.connecting_to_linkedin")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs">
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.redirecting_you_to_linkedin_to_approve_a")}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBE9E5] mb-5">
          <Clock size={26} className="text-[#C6543A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.couldn_t_connect_to_linkedin")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.something_went_wrong_starting_the_connec")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.try_again")}</button>
      </div>
    );
  }

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBEADB] mb-5">
          <Clock size={26} className="text-[#DE814A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.profile_submitted_for_review")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.your_linkedin_profile_has_been_sent_to_o")}</p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.continue_to_portfolio")}</button>
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
          className="text-[#8A8A7E] hover:text-[#1F2A22] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <ProgressBar step={1} totalSteps={totalSteps} />
        </div>
        <span className="text-xs text-[#8A8A7E] shrink-0">
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.step_1_of")}{totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DCE9F7] mx-auto mb-5">
        <FaLinkedin size={26} className="text-[#3E7AC7]" />
      </div>

      <h2 className="text-xl font-bold text-[#1F2A22] text-center mb-2">
        {t("app_freelancer_verification_components_steps_linked_in_connect_step.connect_your_linkedin")}</h2>
      <p className="text-sm text-[#8A8A7E] text-center max-w-xs mx-auto mb-6">
        {t("app_freelancer_verification_components_steps_linked_in_connect_step.we_ll_send_your_profile_to_our_team_to_c")}</p>

      <div className="rounded-xl border border-[#E5E0D6] px-4 py-4 mb-6">
        <p className="text-xs font-medium text-[#1F2A22] mb-3">
          {t("app_freelancer_verification_components_steps_linked_in_connect_step.talentq_will_access")}</p>
        <div className="flex flex-col gap-2">
          {permissions.map((permission) => (
            <div key={permission} className="flex items-start gap-2">
              <CheckCircle2
                size={14}
                className="text-[#3E8E5A] shrink-0 mt-0.5"
              />
              <span className="text-xs text-[#5C5347]">{permission}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleConnect}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] py-3 text-sm font-medium text-white hover:bg-[#095196] transition-colors"
      >
        <FaLinkedin size={16} />
        {t("app_freelancer_verification_components_steps_linked_in_connect_step.continue_with_linkedin")}</button>

      <p className="text-xs text-[#8A8A7E] text-center mt-3">
        {t("app_freelancer_verification_components_steps_linked_in_connect_step.if_your_profile_doesn_t_meet_our_verific")}</p>
    </div>
  );
}
