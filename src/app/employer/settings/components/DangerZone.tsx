"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DangerZone() {
    const { t } = useLanguage();
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't delete your account");

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't delete your account",
      );
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#F2B8AE] bg-white px-6 py-6 mt-6">
      <h3 className="text-base font-semibold text-[#C6543A]">{t("app_employer_settings_components_danger_zone.danger_zone")}</h3>
      <p className="text-xs text-[#8A8A7E] mb-4">
        {t("app_employer_settings_components_danger_zone.these_actions_are_permanent_and_cannot_b")}</p>

      {error && (
        <p className="text-xs text-[#C6543A] bg-[#FBEBE9] rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-2 rounded-full border border-[#E5E0D6] px-4 py-2 text-sm text-[#1F2A22] hover:bg-[#F5F1E9] transition-colors disabled:opacity-60"
        >
          {signingOut ?
            <Loader2 size={14} className="animate-spin" />
          : <LogOut size={14} />}
          {t("app_employer_settings_components_danger_zone.sign_out")}</button>

        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          className="flex items-center gap-2 rounded-full border border-[#E8938A] px-4 py-2 text-sm text-[#C6543A] hover:bg-[#FBEBE9] transition-colors"
        >
          <Trash2 size={14} />
          {t("app_employer_settings_components_danger_zone.delete_account")}</button>
      </div>

      {confirmingDelete && (
        <div className="mt-4 rounded-xl border border-[#E8938A] bg-[#FBEBE9] px-4 py-4">
          <p className="text-sm font-medium text-[#1F2A22] mb-1">
            {t("app_employer_settings_components_danger_zone.are_you_sure_you_want_to_delete_your_acc")}</p>
          <p className="text-xs text-[#8A8A7E] mb-3">
            {t("app_employer_settings_components_danger_zone.this_will_permanently_remove_your_compan")}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className="rounded-full border border-[#E5E0D6] px-4 py-2 text-xs text-[#1F2A22] disabled:opacity-60"
            >
              {t("app_employer_settings_components_danger_zone.cancel")}</button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-full bg-[#C6543A] px-4 py-2 text-xs text-white hover:bg-[#B04A32] transition-colors disabled:opacity-60"
            >
              {deleting && <Loader2 size={12} className="animate-spin" />}
              {t("app_employer_settings_components_danger_zone.yes_delete_my_account")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
