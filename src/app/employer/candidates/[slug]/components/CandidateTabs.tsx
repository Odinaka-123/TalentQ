"use client";

type Tab = "overview" | "portfolio" | "history" | "review";

type CandidateTabsProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "portfolio", label: "Portfolio" },
  { key: "history", label: "Work History" },
  { key: "review", label: "Review" },
];

export default function CandidateTabs({
  active,
  onChange,
}: CandidateTabsProps) {
  return (
    <div className="flex items-center rounded-2xl border border-[#E5E0D6] bg-white p-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm transition-colors ${
            active === tab.key ?
              "border border-[#DE814A] bg-[#FBF0E4] text-[#C6543A] font-medium"
            : "text-[#5C5347] hover:text-[#C6543A]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
