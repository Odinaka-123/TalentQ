"use client";

import { useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import HiringCategoriesModal from "./HiringCategoriesModal";

const coreCategories = [
  "Frontend Development",
  "Backend Engineering",
  "Design & Creative",
  "Data & Analysis",
  "Marketing",
  "Product & Strategy",
  "DevOps & Infrastructure",
  "Machine Automation",
  "Virtual Assistant",
];

type HiringCategoriesStepProps = {
  selected: string[];
  onChange: (categories: string[]) => void;
  onContinue: () => void;
  onSkip: () => void;
};

export default function HiringCategoriesStep({
  selected,
  onChange,
  onContinue,
  onSkip,
}: HiringCategoriesStepProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleCore = (category: string) => {
    onChange(
      selected.includes(category) ?
        selected.filter((c) => c !== category)
      : [...selected, category],
    );
  };

  const removeExtra = (category: string) => {
    onChange(selected.filter((c) => c !== category));
  };

  const extraSelected = selected.filter((c) => !coreCategories.includes(c));

  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] text-center mb-1">
        What roles are you hiring for?
      </h1>
      <p className="text-sm text-[#8A8A7E] text-center mb-6">
        Select all that apply. This powers your AI matching.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {coreCategories.map((category) => {
          const isSelected = selected.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleCore(category)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                isSelected ?
                  "border-[#DE814A] bg-[#FBF0E4] text-[#C6543A] font-medium"
                : "border-[#E5E0D6] text-[#5C5347] hover:border-[#DE814A]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {extraSelected.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {extraSelected.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF0E4] border border-[#DE814A] px-3.5 py-1.5 text-sm text-[#C6543A]"
            >
              {category}
              <button
                type="button"
                onClick={() => removeExtra(category)}
                aria-label={`Remove ${category}`}
                className="hover:opacity-70"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#E5E0D6] px-3.5 py-1.5 text-sm text-[#5C5347] hover:border-[#DE814A] hover:text-[#C6543A] transition-colors"
        >
          <Plus size={14} />
          Not listed? Add categories
        </button>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={selected.length === 0}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
        <ArrowRight size={14} />
      </button>

      <button
        type="button"
        onClick={onSkip}
        className="w-full text-sm text-[#C6543A] font-medium mt-3 hover:underline"
      >
        Skip for now
      </button>

      <HiringCategoriesModal
        open={modalOpen}
        initialSelected={selected}
        onClose={() => setModalOpen(false)}
        onDone={onChange}
      />
    </div>
  );
}
