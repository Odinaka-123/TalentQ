"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Briefcase, UserCircle } from "lucide-react";

type Role = "employer" | "freelancer";

type RoleStepProps = {
  selected: Role | null;
  onSelect: (role: Role) => void;
  onContinue: () => void;
};

export default function RoleStep({
  selected,
  onSelect,
  onContinue,
}: RoleStepProps) {
    const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] mb-1">
        {t("app_onboarding_components_role_step.i_am_joining_as_a")}</h1>
      <p className="text-sm text-[#8A8A7E] mb-5">
        {t("app_onboarding_components_role_step.choose_the_role_that_best_describes_you")}</p>

      <div className="flex flex-col gap-3 mb-6">
        <button
          type="button"
          onClick={() => onSelect("employer")}
          className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${
            selected === "employer" ?
              "border-[#DE814A] bg-[#FBF0E4]"
            : "border-[#E5E0D6] bg-white hover:border-[#DE814A]"
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F1E9] shrink-0">
            <Briefcase size={18} className="text-[#5C5347]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1F2A22]">
              {t("app_onboarding_components_role_step.employer_hirer")}</p>
            <p className="text-xs text-[#8A8A7E] mt-0.5">
              {t("app_onboarding_components_role_step.i_want_to_hire_verified_african_talent_f")}</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect("freelancer")}
          className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${
            selected === "freelancer" ?
              "border-[#DE814A] bg-[#FBF0E4]"
            : "border-[#E5E0D6] bg-white hover:border-[#DE814A]"
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#A8531E] shrink-0">
            <UserCircle size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1F2A22]">
              {t("app_onboarding_components_role_step.freelancer_professional")}</p>
            <p className="text-xs text-[#8A8A7E] mt-0.5">
              {t("app_onboarding_components_role_step.i_want_to_find_work_get_verified_and_gro")}</p>
          </div>
        </button>
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={onContinue}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("app_onboarding_components_role_step.continue")}</button>
    </div>
  );
}
