"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getFreelancerSettings,
  updateProfileInformation,
  uploadAvatar,
} from "@/lib/queries/settings";
import Avatar from "@/components/Avatar";

type Fields = {
  fullName: string;
  headline: string;
  email: string;
  country: string;
  hourlyRate: string;
  workType: string;
};

const emptyFields: Fields = {
  fullName: "",
  headline: "",
  email: "",
  country: "",
  hourlyRate: "",
  workType: "",
};

export default function ProfileInformation() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      const settings = await getFreelancerSettings(user.id);

      if (settings) {
        setFields({
          fullName: settings.fullName,
          headline: settings.headline,
          email: settings.email,
          country: settings.country,
          hourlyRate: settings.hourlyRate,
          workType: settings.workType,
        });
        setAvatarUrl(settings.avatarUrl);
      }

      setLoading(false);
    };

    load();
  }, [supabase]);

  const handleChange = (key: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      await updateProfileInformation(userId, {
        fullName: fields.fullName,
        headline: fields.headline,
        country: fields.country,
        hourlyRate: fields.hourlyRate,
        workType: fields.workType,
      });
      setSaved(true);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save changes.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 2 * 1024 * 1024) {
      setSaveError("Image must be under 2MB.");
      return;
    }

    setUploadingAvatar(true);
    setSaveError(null);

    try {
      const newUrl = await uploadAvatar(userId, file);
      setAvatarUrl(newUrl);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not upload photo.",
      );
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 animate-pulse">
        <div className="h-5 w-40 rounded bg-[#E5E0D6] mb-5" />

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#E5E0D6] shrink-0" />
          <div>
            <div className="h-4 w-24 rounded bg-[#E5E0D6] mb-2" />
            <div className="h-3 w-32 rounded bg-[#EDEAE1]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 rounded bg-[#E5E0D6] mb-1.5" />
              <div className="h-10 w-full rounded-lg bg-[#EDEAE1]" />
            </div>
          ))}
        </div>

        <div className="h-9 w-32 rounded-full bg-[#E5E0D6]" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-base font-semibold text-[#1F2A22] mb-5">
        Profile Information
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[#3E5C50]">
          <Avatar src={avatarUrl} name={fields.fullName || "?"} size={56} />
        </div>
        <div>
          <button
            type="button"
            onClick={handlePhotoClick}
            disabled={uploadingAvatar}
            className="text-sm font-medium text-[#C6543A] hover:underline disabled:opacity-50"
          >
            {uploadingAvatar ? "Uploading..." : "Change Photo"}
          </button>
          <p className="text-xs text-[#8A8A7E] mt-0.5">JPG or PNG · Max 2MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <FormInput
          label="Full Name"
          value={fields.fullName}
          onChange={(v) => handleChange("fullName", v)}
        />
        <FormInput
          label="Professional Title"
          value={fields.headline}
          onChange={(v) => handleChange("headline", v)}
        />
        <FormInput
          label="Email"
          value={fields.email}
          onChange={() => {}}
          type="email"
          disabled
          hint="Contact support to change your email"
        />
        <FormInput
          label="Country"
          value={fields.country}
          onChange={(v) => handleChange("country", v)}
        />
        <FormInput
          label="Hourly Rate"
          value={fields.hourlyRate}
          onChange={(v) => handleChange("hourlyRate", v)}
        />
        <FormInput
          label="Work Type"
          value={fields.workType}
          onChange={(v) => handleChange("workType", v)}
          placeholder="Full Time / Part Time / Contract"
        />
      </div>

      {saveError && <p className="text-xs text-[#FF363A] mb-3">{saveError}</p>}
      {saved && !saveError && (
        <p className="text-xs text-[#3E8E5A] mb-3">Changes saved.</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-full bg-[#A8531E] px-5 py-2 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-xs font-medium text-[#1F2A22]">{label}</label>
        {hint && (
          <span title={hint}>
            <HelpCircle size={12} className="text-[#B9B4A6]" />
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] disabled:bg-[#F5F1E9] disabled:text-[#8A8A7E]"
      />
    </div>
  );
}
