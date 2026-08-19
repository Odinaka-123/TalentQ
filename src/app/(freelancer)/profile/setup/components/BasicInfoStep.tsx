"use client";

type BasicInfoData = {
  fullName: string;
  headline: string;
};

type BasicInfoStepProps = {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
  onContinue: () => void;
};

export default function BasicInfoStep({
  data,
  onChange,
  onContinue,
}: BasicInfoStepProps) {
  const update = (key: keyof BasicInfoData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const canContinue = data.fullName.trim() && data.headline.trim();

  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] mb-1">Basic Info</h1>
      <p className="text-sm text-[#8A8A7E] mb-5">
        This is how employers will see you.
      </p>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Your full name"
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            Professional Title
          </label>
          <input
            type="text"
            value={data.headline}
            onChange={(e) => update("headline", e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
