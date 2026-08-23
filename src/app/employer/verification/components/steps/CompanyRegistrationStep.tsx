"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Upload,
} from "lucide-react";
import ProgressBar from "../ProgressBar";
import { submitCompanyRegistration } from "@/lib/queries/employerVerification";

type CompanyRegistrationStepProps = {
  totalSteps: number;
  userId: string;
  onBack: () => void;
  onContinue: () => void;
};

type Status = "idle" | "uploading" | "submitted" | "error";

export default function CompanyRegistrationStep({
  totalSteps,
  userId,
  onBack,
  onContinue,
}: CompanyRegistrationStepProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!file) return;
    setStatus("uploading");

    const { error } = await submitCompanyRegistration(userId, file);

    if (error) {
      console.error("Company registration upload failed:", error);
      setStatus("error");
      return;
    }

    setStatus("submitted");
  };

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBEADB] mb-5">
          <Clock size={26} className="text-[#DE814A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          Document submitted for review
        </h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          Our team will review your business registration document, usually
          within 1-2 business days.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          Continue
        </button>
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
          className="text-[#8A8A7E] hover:text-[#1F2A22]"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <ProgressBar step={1} totalSteps={totalSteps} />
        </div>
        <span className="text-xs text-[#8A8A7E] shrink-0">
          Step 1 of {totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F7DFEF] mx-auto mb-5">
        <Building2 size={26} className="text-[#C755A0]" />
      </div>

      <h2 className="text-xl font-bold text-[#1F2A22] text-center mb-2">
        Company Registration
      </h2>
      <p className="text-sm text-[#8A8A7E] text-center max-w-xs mx-auto mb-6">
        Upload your business certificate or registration document.
      </p>

      <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E5E0D6] px-4 py-8 mb-6 cursor-pointer hover:border-[#DE814A] transition-colors">
        <Upload size={22} className="text-[#8A8A7E]" />
        <span className="text-sm text-[#5C5347]">
          {file ? file.name : "Click to upload PDF, JPG, or PNG"}
        </span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-[#C6543A] text-center mb-4">
          Upload failed. Please try again.
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!file || status === "uploading"}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50"
      >
        {status === "uploading" ?
          "Uploading..."
        : <>
            <CheckCircle2 size={16} />
            Submit Document
          </>
        }
      </button>
    </div>
  );
}
