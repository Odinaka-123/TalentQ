"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import VerificationModal from "./VerificationModal";
import IntroStep from "./steps/IntroStep";
import IdentityStep from "./steps/IdentityStep";
import LinkedInConnectStep from "./steps/LinkedInConnectStep";
import DiditVerifyStep from "./steps/DiditVerifyStep";

type Step =
  | "intro"
  | "identity"
  | "linkedin-connect"
  | "didit-verify"
  | "portfolio";
type IdentityMethod = "linkedin" | "didit" | null;

const TOTAL_STEPS = 2;

export default function VerificationHero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [identityMethod, setIdentityMethod] = useState<IdentityMethod>(null);

  const closeAndReset = () => {
    setModalOpen(false);
    setStep("intro");
    setIdentityMethod(null);
  };

  return (
    <>
      <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 sm:px-6 py-5 flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="text-[#C6543A] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#1F2A22]">
              Your credentials, finally respected.
            </p>
            <p className="text-xs text-[#8A8A7E] mt-0.5">
              African talent is already world-class. TalentQ makes it provable.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors shrink-0"
        >
          Start Verification
        </button>
      </div>

      <VerificationModal open={modalOpen} onClose={closeAndReset}>
        {step === "intro" && <IntroStep onStart={() => setStep("identity")} />}
        {step === "identity" && (
          <IdentityStep
            totalSteps={TOTAL_STEPS}
            selectedMethod={identityMethod}
            onSelectMethod={setIdentityMethod}
            onBack={() => setStep("intro")}
            onContinue={() => {
              if (identityMethod === "linkedin") setStep("linkedin-connect");
              if (identityMethod === "didit") setStep("didit-verify");
            }}
          />
        )}
        {step === "linkedin-connect" && (
          <LinkedInConnectStep
            totalSteps={TOTAL_STEPS}
            onBack={() => setStep("identity")}
            onContinue={() => setStep("portfolio")}
          />
        )}
        {step === "didit-verify" && (
          <DiditVerifyStep
            totalSteps={TOTAL_STEPS}
            onBack={() => setStep("identity")}
            onContinue={() => setStep("portfolio")}
          />
        )}
        {step === "portfolio" && (
          <div className="text-center text-sm text-[#8A8A7E] py-10">
            Step 2 of 2 — Portfolio (coming next)
          </div>
        )}
      </VerificationModal>
    </>
  );
}
