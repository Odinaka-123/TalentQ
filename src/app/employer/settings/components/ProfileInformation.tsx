"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HelpCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getEmployerProfile,
  updateEmployerProfile,
  type EmployerProfileData,
} from "@/lib/queries/employer-profile";

const EMPTY_FIELDS: EmployerProfileData = {
  fullName: "",
  avatarUrl: null,
  companyName: "",
  industry: "",
  country: "",
  companySize: "",
  budgetRange: "",
};

export default function ProfileInformation() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fields, setFields] = useState<EmployerProfileData>(EMPTY_FIELDS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      const profile = await getEmployerProfile(user.id);
      setFields(profile);
      setLoading(false);
    };

    load();
  }, []);

  const handleChange = (key: keyof EmployerProfileData, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateEmployerProfile(userId, fields);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't save your changes",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 h-96 animate-pulse" />
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-base font-semibold text-[#1F2A22] mb-5">
        Profile Information
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#3E5C50] overflow-hidden shrink-0 relative">
          {fields.avatarUrl && (
            <Image
              src={fields.avatarUrl}
              alt={fields.fullName || "Profile photo"}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div>
          <button
            type="button"
            disabled
            className="text-sm font-medium text-[#C6543A] hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
          >
            Change Photo
          </button>
          <p className="text-xs text-[#8A8A7E] mt-0.5">Coming soon</p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#C6543A] bg-[#FBEBE9] rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-xs text-[#3E8E5A] bg-[#DDEEE2] rounded-lg px-3 py-2 mb-4">
          Changes saved.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <FormInput
          label="Your Name"
          value={fields.fullName}
          onChange={(v) => handleChange("fullName", v)}
        />
        <FormInput
          label="Company Name"
          value={fields.companyName}
          onChange={(v) => handleChange("companyName", v)}
        />
        <FormInput
          label="Industry"
          value={fields.industry}
          onChange={(v) => handleChange("industry", v)}
        />
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className="text-xs font-medium text-[#1F2A22]">Email</label>
            <HelpCircle size={12} className="text-[#B9B4A6]" />
          </div>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-lg border border-[#E5E0D6] bg-[#F5F1E9] px-4 py-2.5 text-sm text-[#8A8A7E] outline-none cursor-not-allowed"
          />
        </div>
        <FormInput
          label="Country"
          value={fields.country}
          onChange={(v) => handleChange("country", v)}
        />
        <FormInput
          label="Budget Range"
          value={fields.budgetRange}
          onChange={(v) => handleChange("budgetRange", v)}
        />
        <FormInput
          label="Company Size"
          value={fields.companySize}
          onChange={(v) => handleChange("companySize", v)}
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-full bg-[#A8531E] px-5 py-2 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-xs font-medium text-[#1F2A22]">{label}</label>
        <HelpCircle size={12} className="text-[#B9B4A6]" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
      />
    </div>
  );
}
