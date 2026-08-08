import { ArrowLeft, ScanFace, ChevronRight } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import ProgressBar from "../ProgressBar";

type IdentityMethod = "linkedin" | "didit" | null;

type IdentityStepProps = {
  totalSteps: number;
  selectedMethod: IdentityMethod;
  onSelectMethod: (method: IdentityMethod) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function IdentityStep({
  totalSteps,
  selectedMethod,
  onSelectMethod,
  onBack,
  onContinue,
}: IdentityStepProps) {
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

      <h2 className="text-xl font-bold text-[#1F2A22] text-center mb-2">
        Confirm your identity
      </h2>
      <p className="text-sm text-[#8A8A7E] text-center max-w-xs mx-auto mb-6">
        We ask for this so employers know you&apos;re really you. Your details
        are encrypted and never shown publicly.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        <button
          type="button"
          onClick={() => onSelectMethod("linkedin")}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
            selectedMethod === "linkedin" ?
              "border-[#DE814A] bg-[#FBF0E4]"
            : "border-[#E5E0D6] hover:border-[#DE814A]"
          }`}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#DCE9F7] shrink-0">
            <FaLinkedin size={16} className="text-[#3E7AC7]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1F2A22]">
              Continue with verified LinkedIn
            </p>
            <p className="text-xs text-[#8A8A7E]">
              Only accepted if your profile passes our verification check
            </p>
          </div>
          <ChevronRight size={16} className="text-[#8A8A7E] shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("didit")}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
            selectedMethod === "didit" ?
              "border-[#DE814A] bg-[#FBF0E4]"
            : "border-[#E5E0D6] hover:border-[#DE814A]"
          }`}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#DDEEE2] shrink-0">
            <ScanFace size={16} className="text-[#3E8E5A]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1F2A22]">
              Continue with Didit
            </p>
            <p className="text-xs text-[#8A8A7E]">
              Fastest way to verify — ID scan + face match
            </p>
          </div>
          <ChevronRight size={16} className="text-[#8A8A7E] shrink-0" />
        </button>
      </div>

      <button
        type="button"
        disabled={!selectedMethod}
        onClick={onContinue}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
