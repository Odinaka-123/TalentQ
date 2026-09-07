"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import {
  ArrowLeft,
  ScanFace,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import ProgressBar from "../ProgressBar";
import { createDiditSession } from "@/lib/queries/verification";

type DiditVerifyStepProps = {
  totalSteps: number;
  userId: string;
  initialStatus?: "pending" | "verified" | "rejected";
  onBack: () => void;
  onContinue: () => void;
};

type Status =
  | "idle"
  | "connecting"
  | "verified"
  | "needs-review"
  | "rejected"
  | "error";

const checks = [
  "Government-issued ID scan",
  "Liveness check (a quick selfie)",
  "Face match against your ID",
];

const initialStatusMap: Record<"pending" | "verified" | "rejected", Status> = {
  pending: "needs-review",
  verified: "verified",
  rejected: "rejected",
};

export default function DiditVerifyStep({
  totalSteps,
  userId,
  initialStatus,
  onBack,
  onContinue,
}: DiditVerifyStepProps) {
    const { t } = useLanguage();
  const [status, setStatus] = useState<Status>(
    initialStatus ? initialStatusMap[initialStatus] : "idle",
  );

  const handleStart = async () => {
    setStatus("connecting");

    const { error, sessionUrl } = await createDiditSession(userId);

    if (error || !sessionUrl) {
      setStatus("error");
      return;
    }

    // Full navigation away from the app — Didit hosts the actual scan/selfie flow.
    // The user returns to /verification (per the `callback` we set) once they're done.
    window.location.href = sessionUrl;
  };

  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <Loader2 size={32} className="text-[#DE814A] animate-spin mb-5" />
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_freelancer_verification_components_steps_didit_verify_step.starting_verification")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs">
          {t("app_freelancer_verification_components_steps_didit_verify_step.redirecting_you_to_a_secure_page_to_scan")}</p>
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DDEEE2] mb-5">
          <CheckCircle2 size={26} className="text-[#3E8E5A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_freelancer_verification_components_steps_didit_verify_step.identity_verified")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          {t("app_freelancer_verification_components_steps_didit_verify_step.your_id_and_liveness_check_both_passed_y")}</p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          {t("app_freelancer_verification_components_steps_didit_verify_step.continue_to_portfolio")}</button>
      </div>
    );
  }

  if (status === "needs-review") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBEADB] mb-5">
          <Clock size={26} className="text-[#DE814A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_freelancer_verification_components_steps_didit_verify_step.sent_for_review")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          {t("app_freelancer_verification_components_steps_didit_verify_step.we_re_confirming_your_id_this_is_usually")}</p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          {t("app_freelancer_verification_components_steps_didit_verify_step.continue_to_portfolio")}</button>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBE9E5] mb-5">
          <XCircle size={26} className="text-[#C6543A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_freelancer_verification_components_steps_didit_verify_step.verification_wasn_t_approved")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          {t("app_freelancer_verification_components_steps_didit_verify_step.something_didn_t_match_on_our_end_you_ca")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          {t("app_freelancer_verification_components_steps_didit_verify_step.try_again")}</button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBE9E5] mb-5">
          <XCircle size={26} className="text-[#C6543A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          {t("app_freelancer_verification_components_steps_didit_verify_step.couldn_t_start_verification")}</h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          {t("app_freelancer_verification_components_steps_didit_verify_step.something_went_wrong_on_our_end_please_t")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          {t("app_freelancer_verification_components_steps_didit_verify_step.try_again")}</button>
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
          {t("app_freelancer_verification_components_steps_didit_verify_step.step_1_of")}{totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DDEEE2] mx-auto mb-5">
        <ScanFace size={26} className="text-[#3E8E5A]" />
      </div>

      <h2 className="text-xl font-bold text-[#1F2A22] text-center mb-2">
        {t("app_freelancer_verification_components_steps_didit_verify_step.verify_with_didit")}</h2>
      <p className="text-sm text-[#8A8A7E] text-center max-w-xs mx-auto mb-6">
        {t("app_freelancer_verification_components_steps_didit_verify_step.scan_a_government_id_and_take_a_quick_se")}</p>

      <div className="rounded-xl border border-[#E5E0D6] px-4 py-4 mb-6">
        <p className="text-xs font-medium text-[#1F2A22] mb-3">
          {t("app_freelancer_verification_components_steps_didit_verify_step.what_you_ll_need")}</p>
        <div className="flex flex-col gap-2">
          {checks.map((check) => (
            <div key={check} className="flex items-start gap-2">
              <CheckCircle2
                size={14}
                className="text-[#3E8E5A] shrink-0 mt-0.5"
              />
              <span className="text-xs text-[#5C5347]">{check}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
      >
        {t("app_freelancer_verification_components_steps_didit_verify_step.start_didit_verification")}</button>

      <p className="text-xs text-[#8A8A7E] text-center mt-3">
        {t("app_freelancer_verification_components_steps_didit_verify_step.your_id_is_encrypted_and_processed_secur")}</p>
    </div>
  );
}
