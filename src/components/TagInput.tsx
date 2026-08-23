"use client";

import { useState } from "react";
import { X } from "lucide-react";

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export default function TagInput({
  tags,
  onChange,
  placeholder,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const commitTag = (raw: string) => {
    const value = raw.trim();
    if (!value || tags.includes(value)) return;
    onChange([...tags, value]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.includes(",")) {
      const parts = value.split(",");
      parts.slice(0, -1).forEach(commitTag);
      setInput(parts[parts.length - 1]);
      return;
    }

    setInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTag(input);
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="w-full rounded-lg border border-[#E5E0D6] bg-white px-2 py-2 flex flex-wrap items-center gap-1.5 focus-within:border-[#DE814A]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-[#FBEADB] pl-2.5 pr-1.5 py-1 text-xs font-medium text-[#A8531E]"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
            className="hover:text-[#732700]"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[6rem] text-sm text-[#1F2A22] outline-none px-1.5 py-0.5"
      />
    </div>
  );
}
