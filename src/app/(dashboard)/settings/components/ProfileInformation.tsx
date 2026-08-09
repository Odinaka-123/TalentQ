"use client";

import { useState } from "react";
import Image from "next/image";
import { HelpCircle } from "lucide-react";

export default function ProfileInformation() {
  const [fields, setFields] = useState({
    fullName: "Henrieta Omogiate",
    title: "Full-Stack Engineer",
    email: "henny@gmail.com",
    country: "Nigeria",
    hourlyRate: "$65",
    availability: "Full Time",
  });

  const handleChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-base font-semibold text-[#1F2A22] mb-5">
        Profile Information
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#3E5C50] overflow-hidden shrink-0">
          <Image
            src="/images/testimonials/felicia.png"
            alt="Profile Picture"
            className="w-full h-full object-cover"
            width={56}
            height={56}
          />
        </div>
        <div>
          <button
            type="button"
            className="text-sm font-medium text-[#C6543A] hover:underline"
          >
            Change Photo
          </button>
          <p className="text-xs text-[#8A8A7E] mt-0.5">JPG or PNG · Max 2MB</p>
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
          value={fields.title}
          onChange={(v) => handleChange("title", v)}
        />
        <FormInput
          label="Email"
          value={fields.email}
          onChange={(v) => handleChange("email", v)}
          type="email"
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
          label="Availability"
          value={fields.availability}
          onChange={(v) => handleChange("availability", v)}
        />
      </div>

      <button
        type="button"
        className="rounded-full bg-[#A8531E] px-5 py-2 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
      >
        Save Changes
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
