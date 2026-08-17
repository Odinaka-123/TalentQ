"use client";

type LocationAvailabilityData = {
  country: string;
  availability: string;
};

type LocationAvailabilityStepProps = {
  data: LocationAvailabilityData;
  onChange: (data: LocationAvailabilityData) => void;
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

const availabilityOptions: { key: string; label: string; dotColor: string }[] =
  [
    { key: "available", label: "Available", dotColor: "#3E8E5A" },
    { key: "busy", label: "Busy", dotColor: "#DE9A3E" },
    { key: "unavailable", label: "Not Available", dotColor: "#8A8A7E" },
  ];

export default function LocationAvailabilityStep({
  data,
  onChange,
  onContinue,
}: LocationAvailabilityStepProps) {
  const update = (key: keyof LocationAvailabilityData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const canContinue = data.country && data.availability;

  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] mb-1">
        Location & Availability
      </h1>
      <p className="text-sm text-[#8A8A7E] mb-5">
        Almost done — one last thing.
      </p>

      <div className="mb-5">
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

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1B3A2F] mb-2">
          Availability
        </label>
        <div className="flex flex-col gap-2">
          {availabilityOptions.map((option) => {
            const isActive = data.availability === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => update("availability", option.key)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left transition-colors ${
                  isActive ?
                    "border-[#DE814A] bg-[#FBF0E4]"
                  : "border-[#E5E0D6] bg-white hover:border-[#DE814A]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: option.dotColor }}
                />
                <span className="text-sm text-[#1F2A22]">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Profile
      </button>
    </div>
  );
}
