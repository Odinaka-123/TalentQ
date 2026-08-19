import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type OnboardingStepperProps = {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  backHref?: string;
};

export default function OnboardingStepper({
  step,
  totalSteps,
  onBack,
  backHref,
}: OnboardingStepperProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#8A8A7E]">
          Step {step} of {totalSteps}
        </span>
        {backHref ?
          <Link
            href={backHref}
            className="flex items-center gap-1 text-xs text-[#C6543A] hover:underline"
          >
            <ArrowLeft size={12} />
            Back
          </Link>
        : onBack ?
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-[#C6543A] hover:underline"
          >
            <ArrowLeft size={12} />
            Back
          </button>
        : null}
      </div>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < step ? "bg-[#A8531E]" : "bg-[#F2DFC8]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
