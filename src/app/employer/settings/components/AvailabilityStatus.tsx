"use client";

import { useState } from "react";

type Status = "available" | "busy" | "unavailable";

const options: { key: Status; label: string; dotColor: string }[] = [
  { key: "available", label: "Available", dotColor: "#3E8E5A" },
  { key: "busy", label: "Busy", dotColor: "#DE9A3E" },
  { key: "unavailable", label: "Not Available", dotColor: "#8A8A7E" },
];

export default function AvailabilityStatus() {
  const [status, setStatus] = useState<Status>("available");

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
              onClick={() => setStatus(option.key)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
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
