"use client";

type Tab = "accounts" | "notification" | "appearance" | "privacy";

type SettingsTabsProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

const tabs: { key: Tab; label: string }[] = [
  { key: "accounts", label: "Accounts" },
  { key: "notification", label: "Notification" },
  { key: "appearance", label: "Appearance" },
  { key: "privacy", label: "Privacy" },
];

export default function SettingsTabs({ active, onChange }: SettingsTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[#E5E0D6] bg-white p-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            active === tab.key ?
              "border border-[#DE814A] text-[#C6543A] bg-[#FBF0E4]"
            : "text-[#5C5347] hover:text-[#C6543A]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
