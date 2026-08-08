import { ShieldCheck, UserCheck, FileText, Sparkles } from "lucide-react";

type IntroStepProps = {
  onStart: () => void;
};

export default function IntroStep({ onStart }: IntroStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[#3E8E5A] mb-6">
        <ShieldCheck size={36} className="text-white" />
      </div>

      <h2 className="text-2xl font-bold text-[#DE814A] mb-3">
        Verify your Skills!
      </h2>

      <p className="text-sm text-[#5C5347] max-w-sm mb-6">
        The badge that actually means something, because we show our work. Get
        verified once, get trusted everywhere on TalentQ.
      </p>

      <div className="flex items-center gap-8 mb-8">
        <div className="flex flex-col items-center gap-1.5">
          <UserCheck size={18} className="text-[#5C5347]" />
          <span className="text-xs text-[#5C5347]">Identity</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <FileText size={18} className="text-[#5C5347]" />
          <span className="text-xs text-[#5C5347]">Portfolio</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Sparkles size={18} className="text-[#5C5347]" />
          <span className="text-xs text-[#5C5347]">Skills</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
      >
        Start Verification
      </button>
    </div>
  );
}
