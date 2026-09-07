"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Users2 } from "lucide-react";

export default function VerificationHero({ onStart }: { onStart: () => void }) {
    const { t } = useLanguage();
  return (
    <div className="rounded-2xl border border-[#E8A47E] bg-white px-6 py-6 mb-6">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DE814A] px-3 py-1 text-xs font-medium text-[#C6543A] mb-4">
        <Users2 size={12} />
        {t("app_employer_verification_components_verification_hero.talent_q_trust_system")}</span>

      <h1 className="text-xl font-bold text-[#1F2A22] mb-2">
        {t("app_employer_verification_components_verification_hero.your_credentials_finally_respected")}</h1>
      <p className="text-sm text-[#8A8A7E] max-w-2xl mb-5">
        {t("app_employer_verification_components_verification_hero.verified_employers_attract_3x_more_quali")}</p>

      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
      >
        {t("app_employer_verification_components_verification_hero.start_verification")}</button>
    </div>
  );
}
