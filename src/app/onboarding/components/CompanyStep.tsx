"use client";

type CompanyData = {
  companyName: string;
  industry: string;
  country: string;
};

type CompanyStepProps = {
  data: CompanyData;
  onChange: (data: CompanyData) => void;
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

export default function CompanyStep({
  data,
  onChange,
  onContinue,
}: CompanyStepProps) {
  const update = (key: keyof CompanyData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const canContinue = data.companyName && data.industry && data.country;

  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] mb-1">
        Tell us about your company
      </h1>
      <p className="text-sm text-[#8A8A7E] mb-5">
        This helps us personalise your experience.
      </p>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            Company Name
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            placeholder="CloudScale"
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B3A2F] mb-1.5">
            Industry / Sector
          </label>
          <input
            type="text"
            value={data.industry}
            onChange={(e) => update("industry", e.target.value)}
            placeholder="Technology"
            className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
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
