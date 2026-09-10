"use client";

import React from "react";
import Image from "next/image";

type Availability = "available" | "busy" | "unavailable";

const availabilityMeta: Record<Availability, { label: string; dotColor: string; textColor: string }> = {
  available: { label: "Available", dotColor: "#3E8E5A", textColor: "#3E8E5A" },
  busy: { label: "Busy", dotColor: "#DE9A3E", textColor: "#DE9A3E" },
  unavailable: { label: "Not Available", dotColor: "#8A8A7E", textColor: "#8A8A7E" },
};

interface ProfileHeaderProps {
  profile: {
    id?: string;
    full_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
  } | null;
  details: {
    headline?: string | null;
    bio?: string | null;
    hourly_rate?: number | null;
    location?: string | null;
    availability?: Availability | null;
  } | null;
}

export default function ProfileHeader({ profile, details }: ProfileHeaderProps) {
  const availability = availabilityMeta[details?.availability ?? "available"];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full bg-[#EDEAE1] overflow-hidden shrink-0">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || "Profile"}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8A8A7E] font-medium text-xl">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#1B3A2F]">
            {profile?.full_name || "Anonymous User"}
          </h1>
          <p className="text-sm text-[#6B7A73]">
            {details?.headline || "No headline set"}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: availability.dotColor }}
            />
            <span className="text-xs font-medium" style={{ color: availability.textColor }}>
              You are — {availability.label}
            </span>
            {details?.location && (
              <span className="text-xs text-[#8A8A7E]">· {details.location}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}