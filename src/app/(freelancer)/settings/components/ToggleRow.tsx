"use client";

type ToggleRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="pr-4">
        <p className="text-sm font-medium text-[#1F2A22]">{title}</p>
        <p className="text-xs text-[#8A8A7E] mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-[#A8531E]" : "bg-[#D9D3C5]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
