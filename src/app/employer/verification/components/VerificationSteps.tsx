import { Check } from "lucide-react";

type StepStatus = "completed" | "active" | "locked";

type Step = {
  number: number;
  title: string;
  description: string;
  status: StepStatus;
};

const steps: Step[] = [
  {
    number: 1,
    title: "Company Registration",
    description: "Upload your business certificate or registration document",
    status: "completed",
  },
  {
    number: 2,
    title: "LinkedIn Verification",
    description: "Connect your company LinkedIn page to confirm legitimacy.",
    status: "completed",
  },
  {
    number: 3,
    title: "Payment Method",
    description: "Connect Paystack or Flutterwave to enable escrow.",
    status: "active",
  },
  {
    number: 4,
    title: "Employer Review",
    description: "Receive your first talent review after a completed contract.",
    status: "locked",
  },
];

export default function VerificationSteps() {
  return (
    <div className="rounded-2xl border border-[#E8A47E] bg-white px-6 py-6 mb-6">
      <h3 className="text-base font-semibold text-[#1F2A22]">
        Verification Steps
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-5">
        Complete all steps to earn your verified Employers badge
      </p>

      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div className="flex items-start gap-3 min-w-0">
              {step.status === "completed" ?
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3E8E5A] text-white shrink-0">
                  <Check size={13} />
                </span>
              : <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 ${
                    step.status === "active" ?
                      "bg-[#A8531E] text-white"
                    : "bg-[#F2DFC8] text-[#DE814A]"
                  }`}
                >
                  {step.number}
                </span>
              }
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1F2A22]">
                  {step.title}
                </p>
                <p className="text-xs text-[#8A8A7E]">{step.description}</p>
              </div>
            </div>

            {step.status === "completed" && (
              <span className="rounded-full bg-[#DDEEE2] px-3 py-1 text-xs text-[#3E8E5A] shrink-0">
                Completed
              </span>
            )}
            {step.status === "active" && (
              <button
                type="button"
                className="rounded-full bg-[#A8531E] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#94481A] transition-colors shrink-0"
              >
                Continue →
              </button>
            )}
            {step.status === "locked" && (
              <span className="rounded-full bg-[#F2DFC8] px-3 py-1 text-xs text-[#DE814A] shrink-0">
                Locked
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
