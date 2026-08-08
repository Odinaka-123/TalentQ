"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ScanFace,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import ProgressBar from "../ProgressBar";

type DiditVerifyStepProps = {
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
};

type Status = "idle" | "connecting" | "verified" | "needs-review";

const checks = [
  "Government-issued ID scan",
  "Liveness check (a quick selfie)",
  "Face match against your ID",
];

export default function DiditVerifyStep({
  totalSteps,
  onBack,
  onContinue,
}: DiditVerifyStepProps) {
  const [status, setStatus] = useState<Status>("idle");

  const handleStart = () => {
    setStatus("connecting");
    // TODO: replace with real Didit session creation (POST /v3/session/),
    // then poll or receive a webhook with the verification decision
    setTimeout(() => {
      setStatus("verified");
    }, 2500);
  };

  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <Loader2 size={32} className="text-[#DE814A] animate-spin mb-5" />
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          Verifying your identity
        </h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs">
          Scanning your ID and confirming it&apos;s really you — this usually
          takes under a minute.
        </p>
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
          Identity verified
        </h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          Your ID and liveness check both passed. Your Identity Verified badge
          is now active.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          Continue to Portfolio
        </button>
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
          Sent for manual review
        </h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          We couldn&apos;t automatically confirm your ID. Our team will review
          it and update your status within 24 hours.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          Continue to Portfolio
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
          className="text-[#8A8A7E] hover:text-[#1F2A22] transition-colors"
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

      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DDEEE2] mx-auto mb-5">
        <ScanFace size={26} className="text-[#3E8E5A]" />
      </div>

      <h2 className="text-xl font-bold text-[#1F2A22] text-center mb-2">
        Verify with Didit
      </h2>
      <p className="text-sm text-[#8A8A7E] text-center max-w-xs mx-auto mb-6">
        Scan a government ID and take a quick selfie. Most people are verified
        in under a minute.
      </p>

      <div className="rounded-xl border border-[#E5E0D6] px-4 py-4 mb-6">
        <p className="text-xs font-medium text-[#1F2A22] mb-3">
          What you&apos;ll need:
        </p>
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
        Start Didit Verification
      </button>

      <p className="text-xs text-[#8A8A7E] text-center mt-3">
        Your ID is encrypted and processed securely by Didit — TalentQ never
        stores a copy of your document.
      </p>
    </div>
  );
}
