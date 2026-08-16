"use client";

type FreelancerProfileData = {
  headline: string;
  hourlyRate: string;
  yearsExperience: string;
  country: string;
};

type FreelancerProfileStepProps = {
  data: FreelancerProfileData;
  onChange: (data: FreelancerProfileData) => void;
  onContinue: () => void;
};

const countries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Egypt",
  "Morocco",
  "Senegal",
  "Rwanda",
  "Other",
];

export default function FreelancerProfileStep({
  data,
  onChange,
  onContinue,
}: FreelancerProfileStepProps) {
  const update = (key: keyof FreelancerProfileData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const canContinue = data.headline && data.hourlyRate && data.country;

  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] mb-1">
        Tell us about yourself
      </h1>
      <p className="text-sm text-[#8A8A7E] mb-5">
        This helps employers understand what you do.
      </p>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            Professional Title
          </label>
          <input
            type="text"
            value={data.headline}
            onChange={(e) => update("headline", e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              placeholder="6"
              className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            Country
          </label>
          <select
            value={data.country}
            onChange={(e) => update("country", e.target.value)}
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          >
            <option value="" disabled>
              Select your country
            </option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
