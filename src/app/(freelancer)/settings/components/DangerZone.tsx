"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";

export default function DangerZone() {
    const { t } = useLanguage();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="rounded-2xl border border-[#F2B8AE] bg-white px-6 py-6 mt-6">
      <h3 className="text-base font-semibold text-[#FF7166]">{t("app_freelancer_settings_components_danger_zone.danger_zone")}</h3>
      <p className="text-xs text-[#8A8A7E] mb-4">
        {t("app_freelancer_settings_components_danger_zone.these_actions_are_permanent_and_cannot_b")}</p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#DE814A] px-4 py-2 text-sm text-[#DE814A] hover:bg-[#F5F1E9] transition-colors"
        >
          <LogOut size={14} />
          {t("app_freelancer_settings_components_danger_zone.sign_out")}</button>

        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          className="flex bg-[#FFE6E6] items-center gap-2 rounded-lg border border-[#FF363A] px-4 py-2 text-sm text-[#FF363A] hover:bg-[#ED1519] hover:text-[#FFE6E6] transition-colors"
        >
          <Trash2 size={14} />
          {t("app_freelancer_settings_components_danger_zone.delete_account")}</button>
      </div>

      {confirmingDelete && (
        <div className="mt-4 rounded-xl border border-[#E8938A] bg-[#FBEBE9] px-4 py-4">
          <p className="text-sm font-medium text-[#1F2A22] mb-1">
            {t("app_freelancer_settings_components_danger_zone.are_you_sure_you_want_to_delete_your_acc")}</p>
          <p className="text-xs text-[#8A8A7E] mb-3">
            {t("app_freelancer_settings_components_danger_zone.this_will_permanently_remove_your_profil")}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full border border-[#E5E0D6] px-4 py-2 text-xs text-[#1F2A22]"
            >
              {t("app_freelancer_settings_components_danger_zone.cancel")}</button>
            <button
              type="button"
              className="rounded-full bg-[#C6543A] px-4 py-2 text-xs text-white hover:bg-[#B04A32] transition-colors"
            >
              {t("app_freelancer_settings_components_danger_zone.yes_delete_my_account")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
