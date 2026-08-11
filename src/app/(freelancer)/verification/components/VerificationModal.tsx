"use client";

import { X } from "lucide-react";

type VerificationModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function VerificationModal({
  open,
  onClose,
  children,
}: VerificationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white px-6 sm:px-8 py-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-[#8A8A7E] hover:bg-[#F5F1E9] transition-colors"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
