"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import SkillSelectorModal from "./SkillSelectorModal";

type SkillSelectorProps = {
  selected: string[];
  onChange: (skills: string[]) => void;
};

export default function SkillSelector({ selected, onChange }: SkillSelectorProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const removeSkill = (skill: string) => {
    onChange(selected.filter((s) => s !== skill));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {selected.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF0E4] border border-[#DE814A] px-3 py-1.5 text-sm text-[#C6543A]"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
              className="hover:opacity-70"
            >
              <X size={13} />
            </button>
          </span>
        ))}

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#E5E0D6] px-3.5 py-1.5 text-sm text-[#5C5347] hover:border-[#DE814A] hover:text-[#C6543A] transition-colors"
        >
          <Plus size={14} />
          {selected.length > 0 ? "Add more skills" : "Add skills"}
        </button>
      </div>

      <SkillSelectorModal
        open={modalOpen}
        initialSelected={selected}
        onClose={() => setModalOpen(false)}
        onDone={onChange}
      />
    </div>
  );
}