"use client";

type FilterKey =
  | "all"
  | "Applied"
  | "Invited"
  | "Interviewing"
  | "Offer Sent"
  | "Hired";

type StatusFilterTabsProps = {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
};

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Applied", label: "Applied" },
  { key: "Invited", label: "Invited" },
  { key: "Interviewing", label: "Interviewing" },
  { key: "Offer Sent", label: "Offer Sent" },
  { key: "Hired", label: "Hired" },
];

export default function StatusFilterTabs({
  active,
  onChange,
}: StatusFilterTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-[#E5E0D6] bg-white p-1 mb-4 overflow-x-auto">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          className={`shrink-0 rounded-xl px-4 py-2 text-sm transition-colors ${
            active === filter.key ?
              "border border-[#DE814A] bg-[#FBF0E4] text-[#C6543A] font-medium"
            : "text-[#5C5347] hover:text-[#C6543A]"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
