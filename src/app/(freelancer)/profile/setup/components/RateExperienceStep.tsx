"use client";

type RateExperienceData = {
  hourlyRate: string;
  yearsExperience: string;
};

type RateExperienceStepProps = {
  data: RateExperienceData;
  onChange: (data: RateExperienceData) => void;
  onContinue: () => void;
};

export default function RateExperienceStep({
  data,
  onChange,
  onContinue,
}: RateExperienceStepProps) {
  const update = (key: keyof RateExperienceData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const canContinue = data.hourlyRate.trim();

  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] mb-1">
        Rate & Experience
      </h1>
      <p className="text-sm text-[#8A8A7E] mb-5">
        Set your rate — you can change this anytime.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            Hourly Rate ($)
          </label>
          <input
            type="number"
            value={data.hourlyRate}
            onChange={(e) => update("hourlyRate", e.target.value)}
            placeholder="45"
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            Years of Experience
          </label>
          <input
            type="number"
            value={data.yearsExperience}
            onChange={(e) => update("yearsExperience", e.target.value)}
            placeholder="3"
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
