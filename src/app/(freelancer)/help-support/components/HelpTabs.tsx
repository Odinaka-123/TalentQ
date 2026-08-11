"use client";

type Tab = "guides" | "contact";

type HelpTabsProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

const tabs: { key: Tab; label: string }[] = [
  { key: "guides", label: "Guides & FAQs" },
  { key: "contact", label: "Contact Support" },
];

export default function HelpTabs({ active, onChange }: HelpTabsProps) {
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
