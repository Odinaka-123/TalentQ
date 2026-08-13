"use client";

import { useState, useMemo } from "react";
import { Check, Search, X } from "lucide-react";
import { skillCategories } from "./skillsData";

type SkillSelectorModalProps = {
  open: boolean;
  initialSelected: string[];
  onClose: () => void;
  onDone: (skills: string[]) => void;
};

export default function SkillSelectorModal({
  open,
  initialSelected,
  onClose,
  onDone,
}: SkillSelectorModalProps) {
  const [draftSelected, setDraftSelected] = useState<string[]>(initialSelected);
  const [query, setQuery] = useState("");

  const toggleSkill = (skill: string) => {
    setDraftSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return skillCategories;
    const lowerQuery = query.toLowerCase();
    return skillCategories
      .map((category) => ({
        ...category,
        skills: category.skills.filter((skill) =>
          skill.toLowerCase().includes(lowerQuery),
        ),
      }))
      .filter((category) => category.skills.length > 0);
  }, [query]);

  if (!open) return null;

  const handleDone = () => {
    onDone(draftSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#EFEBE2]">
          <h2 className="text-base font-semibold text-[#1F2A22]">Add skills</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-8 h-8 rounded-full text-[#8A8A7E] hover:bg-[#F5F1E9] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="relative mb-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A7E]"
            />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full rounded-full border border-[#E5E0D6] bg-[#F5F1E9] pl-10 pr-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>
          <p className="text-xs text-[#8A8A7E] px-1 py-2">
            {draftSelected.length} selected
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {filteredCategories.length === 0 && (
            <p className="text-sm text-[#8A8A7E] text-center py-10">
              No skills found for &quot;{query}&quot;
            </p>
          )}

          <div className="flex flex-col gap-5">
            {filteredCategories.map((category) => (
              <div key={category.name}>
                <p className="text-xs font-semibold tracking-wide text-[#8A8A7E] uppercase mb-2">
                  {category.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => {
                    const isSelected = draftSelected.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                          isSelected ?
                            "border-[#DE814A] bg-[#FBF0E4] text-[#C6543A] font-medium"
                          : "border-[#E5E0D6] text-[#5C5347] hover:border-[#DE814A]"
                        }`}
                      >
                        {isSelected && <Check size={13} />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#EFEBE2]">
          <button
            type="button"
            onClick={handleDone}
            className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
