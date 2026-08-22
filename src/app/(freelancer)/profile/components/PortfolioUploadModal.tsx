"use client";

import { useState, useRef } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";

export type PortfolioDraft = {
  title: string;
  tags: string[];
  imageFile: File | null;
};

type PortfolioUploadModalProps = {
  onClose: () => void;
  onSubmit: (draft: PortfolioDraft) => Promise<void>;
};

export default function PortfolioUploadModal({
  onClose,
  onSubmit,
}: PortfolioUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptFile = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setError(null);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const commitTag = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    setTags((prev) => (prev.includes(value) ? prev : [...prev, value]));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.includes(",")) {
      const parts = value.split(",");
      // everything before the last comma becomes a chip; keep the tail typing
      parts.slice(0, -1).forEach(commitTag);
      setTagInput(parts[parts.length - 1]);
      return;
    }

    setTagInput(value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      // backspace on an empty field removes the last chip, like LinkedIn
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Give the project a title");
      return;
    }
    if (!imageFile) {
      setError("Add an image");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // catch a tag left in the input field that never hit a comma/Enter
      const finalTags = tagInput.trim() ? [...tags, tagInput.trim()] : tags;

      await onSubmit({ title: title.trim(), tags: finalTags, imageFile });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[#1F2A22]">
            Add Portfolio Item
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#8A8A7E] hover:text-[#1F2A22] p-1"
          >
            <X size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden relative transition-colors ${
            isDragging ?
              "border-[#DE814A] bg-[#FBF0E4]"
            : "border-[#E5E0D6] bg-[#F5F1E9] hover:border-[#DE814A]"
          }`}
        >
          {previewUrl ?
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          : <>
              <ImagePlus
                size={22}
                className={isDragging ? "text-[#DE814A]" : "text-[#8A8A7E]"}
              />
              <span className="text-xs text-[#8A8A7E]">
                {isDragging ? "Drop to upload" : "Click or drag an image here"}
              </span>
            </>
          }
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col gap-3 mb-4">
          <div>
            <label className="text-xs text-[#8A8A7E] block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. E-commerce Dashboard"
              className="w-full rounded-lg border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>

          <div>
            <label className="text-xs text-[#8A8A7E] block mb-1">Tags</label>
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
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "React, TypeScript…" : ""}
                className="flex-1 min-w-[6rem] text-sm text-[#1F2A22] outline-none px-1.5 py-0.5"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-[#C6543A] mb-3">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-full border border-[#DE814A] py-2.5 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-full bg-[#A8531E] py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "Uploading…" : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
