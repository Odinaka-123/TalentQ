"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getFreelancerSettings,
  updateAvailability,
} from "@/lib/queries/settings";

type Status = "available" | "busy" | "unavailable";

const options: { key: Status; label: string; dotColor: string }[] = [
  { key: "available", label: "Available", dotColor: "#3E8E5A" },
  { key: "busy", label: "Busy", dotColor: "#DE9A3E" },
  { key: "unavailable", label: "Not Available", dotColor: "#8A8A7E" },
];

export default function AvailabilityStatus() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("available");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      if (settings) setStatus(settings.availability);
      setLoading(false);
    };

    load();
  }, [supabase]);

  const handleSelect = async (key: Status) => {
    if (!userId || key === status) return;

    const previous = status;
    setStatus(key);
    setUpdating(true);

    try {
      await updateAvailability(userId, key);
    } catch {
      setStatus(previous);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 mt-6 animate-pulse">
        <div className="h-5 w-36 rounded bg-[#E5E0D6] mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-11 rounded-xl bg-[#EDEAE1]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 mt-6">
      <h3 className="text-base font-semibold text-[#1F2A22] mb-4">
        Availability Status
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isActive = status === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => handleSelect(option.key)}
              disabled={updating}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors disabled:opacity-60 ${
                isActive ?
                  "border-[#DE814A] bg-[#FBF0E4]"
                : "border-[#E5E0D6] bg-white hover:border-[#DE814A]"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: option.dotColor }}
              />
              <span className="text-sm text-[#1F2A22]">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
