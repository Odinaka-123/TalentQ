"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

export type InviteDraft = {
  email: string;
  role: string;
};

type InviteTeamMemberModalProps = {
  onClose: () => void;
  onSubmit: (draft: InviteDraft) => Promise<void>;
};

const roles = ["Admin", "Recruiter", "Viewer"];

export default function InviteTeamMemberModal({
  onClose,
  onSubmit,
}: InviteTeamMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({ email: email.trim(), role });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[#1F2A22]">
            Invite Team Member
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#8A8A7E] hover:text-[#1F2A22] p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <div>
            <label className="text-xs text-[#8A8A7E] block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="w-full rounded-lg border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>

          <div>
            <label className="text-xs text-[#8A8A7E] block mb-1">Role</label>
            <div className="flex gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors ${
                    role === r ?
                      "border-[#DE814A] bg-[#FBF0E4] text-[#C6543A]"
                    : "border-[#E5E0D6] text-[#8A8A7E] hover:border-[#DE814A]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-[#C6543A] mb-3">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-full border border-[#DE814A] py-2.5 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-full bg-[#A8531E] py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "Sending…" : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
