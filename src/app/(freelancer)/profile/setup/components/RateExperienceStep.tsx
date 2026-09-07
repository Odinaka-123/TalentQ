"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

type RateExperienceData = {
  hourlyRate: string;
  yearsExperience: string;
};

type RateExperienceStepProps = {
  data: RateExperienceData;
  onChange: (data: RateExperienceData) => void;
  onContinue: () => void;
};

export default function RateExperienceStep({
  data,
  onChange,
  onContinue,
}: RateExperienceStepProps) {
    const { t } = useLanguage();
  const update = (key: keyof RateExperienceData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const canContinue = data.hourlyRate.trim();

  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] mb-1">
        {t("app_freelancer_profile_setup_components_rate_experience_step.rate_experience")}</h1>
      <p className="text-sm text-[#8A8A7E] mb-5">
        {t("app_freelancer_profile_setup_components_rate_experience_step.set_your_rate_you_can_change_this_anytim")}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            {t("app_freelancer_profile_setup_components_rate_experience_step.hourly_rate")}</label>
          <input
            type="number"
            value={data.hourlyRate}
            onChange={(e) => update("hourlyRate", e.target.value)}
            placeholder="45"
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            {t("app_freelancer_profile_setup_components_rate_experience_step.years_of_experience")}</label>
          <input
            type="number"
            value={data.yearsExperience}
            onChange={(e) => update("yearsExperience", e.target.value)}
            placeholder="3"
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("app_freelancer_profile_setup_components_rate_experience_step.continue")}</button>
    </div>
  );
}
