"use client";

import { useState } from "react";
import { Sun, Moon, ChevronDown } from "lucide-react";

type Density = "compact" | "comfortable" | "spacious";
type Theme = "light" | "dark";

const densityOptions: { key: Density; label: string }[] = [
  { key: "compact", label: "Compact" },
  { key: "comfortable", label: "Comfortable" },
  { key: "spacious", label: "Spacious" },
];

export default function AppearanceTab() {
  const [density, setDensity] = useState<Density>("compact");
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState("English UK");
  const [currency, setCurrency] = useState("USD ($)");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timezone, setTimezone] = useState("Nigeria (GMT+1)");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-[#1F2A22]">Density</h3>
        <p className="text-xs text-[#8A8A7E] mb-4">
          Control how compact the interface feels
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {densityOptions.map((option) => {
            const isActive = density === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setDensity(option.key)}
                className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
                  isActive ?
                    "border-[#DE814A] bg-[#FBF0E4] text-[#C6543A] font-medium"
                  : "border-[#E5E0D6] bg-white text-[#1F2A22] hover:border-[#DE814A]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[#1F2A22]">
          Language & Region
        </h3>
        <p className="text-xs text-[#8A8A7E] mb-4">
          Display language and date/time format
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Language"
            value={language}
            onChange={setLanguage}
            options={["English UK", "English US", "French", "Portuguese"]}
          />
          <SelectField
            label="Currency display"
            value={currency}
            onChange={setCurrency}
            options={["USD ($)", "NGN (₦)", "GHS (₵)", "KES (KSh)"]}
          />
          <SelectField
            label="Date format"
            value={dateFormat}
            onChange={setDateFormat}
            options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
          />
          <SelectField
            label="Timezone"
            value={timezone}
            onChange={setTimezone}
            options={[
              "Nigeria (GMT+1)",
              "Ghana (GMT+0)",
              "Kenya (GMT+3)",
              "UTC (GMT+0)",
            ]}
          />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[#1F2A22]">Theme</h3>
        <p className="text-xs text-[#8A8A7E] mb-4">
          Choose your preferred colour scheme
        </p>

        <div className="grid grid-cols-2 max-w-xs gap-3">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 transition-colors ${
              theme === "light" ?
                "border-[#DE814A] bg-[#FBF0E4]"
              : "border-[#E5E0D6] bg-white hover:border-[#DE814A]"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[#E5E0D6]">
              <Sun size={18} className="text-[#1F2A22]" />
            </div>
            <span
              className={`text-sm ${
                theme === "light" ?
                  "text-[#C6543A] font-medium"
                : "text-[#8A8A7E]"
              }`}
            >
              Light
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 transition-colors ${
              theme === "dark" ?
                "border-[#DE814A] bg-[#FBF0E4]"
              : "border-[#E5E0D6] bg-white hover:border-[#DE814A]"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1F2A22]">
              <Moon size={18} className="text-white" />
            </div>
            <span
              className={`text-sm ${
                theme === "dark" ?
                  "text-[#C6543A] font-medium"
                : "text-[#8A8A7E]"
              }`}
            >
              Dark
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-[#E8C9A8] bg-[#FBF0E4] px-4 py-2.5 pr-9 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A7E] pointer-events-none"
        />
      </div>
    </div>
  );
}
