"use client";

import { useState } from "react";
import { Sun, Moon, ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import type { CurrencyCode } from "@/lib/queries/currency";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageOptions, type LanguageCode } from "@/lib/i18n/translations";

type Density = "compact" | "comfortable" | "spacious";
type Theme = "light" | "dark";

const currencyOptions: { value: CurrencyCode; label: string }[] = [
    { value: "USD", label: "USD ($)" },
    { value: "NGN", label: "NGN (₦)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
];

export default function AppearanceTab() {
    const [density, setDensity] = useState<Density>("compact");
    const [theme, setTheme] = useState<Theme>("light");
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
    const [timezone, setTimezone] = useState("Nigeria (GMT+1)");
    const { currency, setCurrency } = useCurrency();
    const { language, setLanguage, t } = useLanguage();

    const densityOptions: { key: Density; label: string }[] = [
        { key: "compact", label: t("settings.appearance.density.compact") },
        { key: "comfortable", label: t("settings.appearance.density.comfortable") },
        { key: "spacious", label: t("settings.appearance.density.spacious") },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
                <h3 className="text-base font-semibold text-[#1F2A22]">
                    {t("settings.appearance.density.title")}
                </h3>
                <p className="text-xs text-[#8A8A7E] mb-4">
                    {t("settings.appearance.density.subtitle")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {densityOptions.map((option) => {
                        const isActive = density === option.key;
                        return (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => setDensity(option.key)}
                                className={`rounded-xl border px-4 py-3 text-sm transition-colors ${isActive ?
                                    "border-[#DE814A] bg-[#FBF0E4] text-[#C6543A] font-medium"
                                    : "border-[#E5E0D6] text-[#1F2A22] hover:border-[#DE814A]"
                                    }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
                <h3 className="text-base font-semibold text-[#1F2A22]">
                    {t("settings.appearance.region.title")}
                </h3>
                <p className="text-xs text-[#8A8A7E] mb-4">
                    {t("settings.appearance.region.subtitle")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
                            {t("settings.appearance.region.language")}
                        </label>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                                className="w-full appearance-none rounded-lg border border-[#E5E0D6] bg-white px-4 py-2.5 pr-9 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
                            >
                                {languageOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A7E] pointer-events-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
                            {t("settings.appearance.region.currency")}
                        </label>
                        <div className="relative">
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                                className="w-full appearance-none rounded-lg border border-[#E5E0D6] bg-white px-4 py-2.5 pr-9 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
                            >
                                {currencyOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A7E] pointer-events-none"
                            />
                        </div>
                    </div>

                    <SelectField
                        label={t("settings.appearance.region.dateFormat")}
                        value={dateFormat}
                        onChange={setDateFormat}
                        options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
                    />
                    <SelectField
                        label={t("settings.appearance.region.timezone")}
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

            <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
                <h3 className="text-base font-semibold text-[#1F2A22]">
                    {t("settings.appearance.theme.title")}
                </h3>
                <p className="text-xs text-[#8A8A7E] mb-4">
                    {t("settings.appearance.theme.subtitle")}
                </p>

                <div className="grid grid-cols-2 max-w-xs gap-3">
                    <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 transition-colors ${theme === "light" ?
                            "border-[#DE814A] bg-[#FBF0E4]"
                            : "border-[#E5E0D6] hover:border-[#DE814A]"
                            }`}
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[#E5E0D6]">
                            <Sun size={18} className="text-[#1F2A22]" />
                        </div>
                        <span
                            className={`text-sm ${theme === "light" ?
                                "text-[#C6543A] font-medium"
                                : "text-[#8A8A7E]"
                                }`}
                        >
                            {t("settings.appearance.theme.light")}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 transition-colors ${theme === "dark" ?
                            "border-[#DE814A] bg-[#FBF0E4]"
                            : "border-[#E5E0D6] hover:border-[#DE814A]"
                            }`}
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1F2A22]">
                            <Moon size={18} className="text-white" />
                        </div>
                        <span
                            className={`text-sm ${theme === "dark" ?
                                "text-[#C6543A] font-medium"
                                : "text-[#8A8A7E]"
                                }`}
                        >
                            {t("settings.appearance.theme.dark")}
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
                    className="w-full appearance-none rounded-lg border border-[#E5E0D6] bg-white px-4 py-2.5 pr-9 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
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