"use client";

import { useState, useRef } from "react";
import { X, Loader2, ImagePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatarImage } from "@/lib/storage/avatar";
import TagInput from "../../../../components/TagInput";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
  identity_verification_status: string | null;
};

type EmployerDetails = {
  company_name: string | null;
  industry: string | null;
  country: string | null;
  company_size: string | null;
  budget_range: string | null;
  hiring_categories: string[] | null;
} | null;

type EditProfileModalProps = {
  userId: string;
  profile: Profile;
  details: EmployerDetails;
  onClose: () => void;
  onSaved: (profile: Profile, details: EmployerDetails) => void;
};

export default function EditProfileModal({
  userId,
  profile,
  details,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar_url,
  );
  const [isDragging, setIsDragging] = useState(false);

  const [companyName, setCompanyName] = useState(details?.company_name ?? "");
  const [industry, setIndustry] = useState(details?.industry ?? "");
  const [country, setCountry] = useState(details?.country ?? "");
  const [companySize, setCompanySize] = useState(details?.company_size ?? "");
  const [budgetRange, setBudgetRange] = useState(details?.budget_range ?? "");
  const [categories, setCategories] = useState<string[]>(
    details?.hiring_categories ?? [],
  );

  const [saving, setSaving] = useState(false);
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
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const supabase = createClient();

    try {
      let avatarUrl = profile.avatar_url;

      if (avatarFile) {
        avatarUrl = await uploadAvatarImage(supabase, userId, avatarFile);
      }

      const [profileRes, detailsRes] = await Promise.all([
        supabase
          .from("profiles")
          .update({
            full_name: fullName || null,
            avatar_url: avatarUrl,
          })
          .eq("id", userId),
        supabase.from("employer_details").upsert({
          id: userId,
          company_name: companyName || null,
          industry: industry || null,
          country: country || null,
          company_size: companySize || null,
          budget_range: budgetRange || null,
          hiring_categories: categories.length > 0 ? categories : null,
        }),
      ]);

      if (profileRes.error || detailsRes.error) {
        console.error(
          "Profile save failed:",
          profileRes.error ?? detailsRes.error,
        );
        setError("Couldn't save your changes. Please try again.");
        return;
      }

      onSaved(
        { ...profile, full_name: fullName || null, avatar_url: avatarUrl },
        {
          company_name: companyName || null,
          industry: industry || null,
          country: country || null,
          company_size: companySize || null,
          budget_range: budgetRange || null,
          hiring_categories: categories,
        },
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't save your changes.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={saving ? undefined : onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#1F2A22]">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="flex items-center justify-center w-8 h-8 rounded-full text-[#8A8A7E] hover:bg-[#F5F1E9] transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[#E8B7A9] bg-[#FFF4F0] px-4 py-3">
            <p className="text-sm text-[#C6543A]">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Logo
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 overflow-hidden relative transition-colors ${
                isDragging ?
                  "border-[#DE814A] bg-[#FBF0E4]"
                : "border-[#E5E0D6] bg-[#F5F1E9] hover:border-[#DE814A]"
              }`}
            >
              {avatarPreview ?
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              : <>
                  <ImagePlus
                    size={20}
                    className={isDragging ? "text-[#DE814A]" : "text-[#8A8A7E]"}
                  />
                  <span className="text-xs text-[#8A8A7E]">
                    {isDragging ?
                      "Drop to upload"
                    : "Click or drag a logo here"}
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
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-[#E5E0D6] px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>

          <div className="border-t border-[#F0ECE3] pt-4">
            <p className="text-xs font-semibold text-[#8A8A7E] uppercase tracking-wide mb-3">
              Company details
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Company name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-[#E5E0D6] px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-[#E5E0D6] px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-[#E5E0D6] px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
                Company size
              </label>
              <input
                type="text"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                placeholder="e.g. 11-50"
                className="w-full rounded-lg border border-[#E5E0D6] px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
                Budget range
              </label>
              <input
                type="text"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                placeholder="e.g. $1k-5k/mo"
                className="w-full rounded-lg border border-[#E5E0D6] px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Hiring categories
            </label>
            <TagInput
              tags={categories}
              onChange={setCategories}
              placeholder="Design, Engineering, Marketing"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-full border border-[#E5E0D6] py-2.5 text-sm font-medium text-[#1F2A22] hover:bg-[#F5F1E9] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-full bg-[#A8531E] py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
