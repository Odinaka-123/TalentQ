"use client";

import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";

export default function DangerZone() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="rounded-2xl border border-[#F2B8AE] bg-white px-6 py-6 mt-6">
      <h3 className="text-base font-semibold text-[#FF7166]">Danger Zone</h3>
      <p className="text-xs text-[#8A8A7E] mb-4">
        These actions are permanent and cannot be undone
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#DE814A] px-4 py-2 text-sm text-[#DE814A] hover:bg-[#F5F1E9] transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>

        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          className="flex bg-[#FFE6E6] items-center gap-2 rounded-lg border border-[#FF363A] px-4 py-2 text-sm text-[#FF363A] hover:bg-[#ED1519] hover:text-[#FFE6E6] transition-colors"
        >
          <Trash2 size={14} />
          Delete Account
        </button>
      </div>

      {confirmingDelete && (
        <div className="mt-4 rounded-xl border border-[#E8938A] bg-[#FBEBE9] px-4 py-4">
          <p className="text-sm font-medium text-[#1F2A22] mb-1">
            Are you sure you want to delete your account?
          </p>
          <p className="text-xs text-[#8A8A7E] mb-3">
            This will permanently remove your profile, contracts, and payment
            history. This cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full border border-[#E5E0D6] px-4 py-2 text-xs text-[#1F2A22]"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-full bg-[#C6543A] px-4 py-2 text-xs text-white hover:bg-[#B04A32] transition-colors"
            >
              Yes, delete my account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
