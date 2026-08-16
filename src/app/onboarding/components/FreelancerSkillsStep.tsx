"use client";

import { ArrowRight } from "lucide-react";
import SkillSelector from "@/components/SkillSelector/SkillSelector";

type FreelancerSkillsStepProps = {
  selected: string[];
  onChange: (skills: string[]) => void;
  onContinue: () => void;
};

export default function FreelancerSkillsStep({
  selected,
  onChange,
  onContinue,
}: FreelancerSkillsStepProps) {
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1F2A22] text-center mb-1">
        What are your skills?
      </h1>
      <p className="text-sm text-[#8A8A7E] text-center mb-6">
        Select all that apply. This powers your AI job matching.
      </p>

      <div className="mb-8">
        <SkillSelector selected={selected} onChange={onChange} />
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
    </div>
  );
}
