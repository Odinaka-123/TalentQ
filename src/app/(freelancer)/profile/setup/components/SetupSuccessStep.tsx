import { Check } from "lucide-react";

type SetupSuccessStepProps = {
  onDone: () => void;
};

export default function SetupSuccessStep({ onDone }: SetupSuccessStepProps) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#DDEEE2] mb-5">
        <Check size={26} className="text-[#3E8E5A]" />
      </div>

      <h1 className="text-xl font-bold text-[#1F2A22] mb-2">
        Profile updated!
      </h1>
      <p className="text-sm text-[#8A8A7E] max-w-sm mb-6">
        Your profile is looking good. Employers can now see your full details.
      </p>

      <button
        type="button"
        onClick={onDone}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
      >
        Back to Profile
      </button>
    </div>
  );
}
