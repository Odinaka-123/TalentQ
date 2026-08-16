import { Check, Sparkles, Lock, ShieldCheck } from "lucide-react";

type OnboardingSuccessStepProps = {
  name: string;
  onGoToDashboard: () => void;
};

const nextSteps = [
  {
    icon: Sparkles,
    text: "Post your first job and get AI-matched talent in minutes",
  },
  {
    icon: Lock,
    text: "Set up escrow to protect every payment you make",
  },
  {
    icon: ShieldCheck,
    text: "Complete employer verification to attract top talent",
  },
];

export default function OnboardingSuccessStep({
  name,
  onGoToDashboard,
}: OnboardingSuccessStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#DDEEE2] mb-5">
        <Check size={26} className="text-[#3E8E5A]" />
      </div>

      <h1 className="text-xl font-bold text-[#1F2A22] mb-2">
        Your account is ready!
      </h1>
      <p className="text-sm text-[#8A8A7E] max-w-sm mb-6">
        Welcome, {name}. Your employer account is set up. Start posting jobs and
        discovering verified African talent.
      </p>

      <div className="flex flex-col gap-2 w-full mb-6">
        {nextSteps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl bg-[#FBF0E4] px-4 py-3 text-left"
          >
            <step.icon size={16} className="text-[#DE814A] shrink-0" />
            <p className="text-sm text-[#1F2A22]">{step.text}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onGoToDashboard}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
