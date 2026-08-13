"use client";

import { useState } from "react";

type Partner = {
  key: string;
  name: string;
  meta: string;
};

const partners: Partner[] = [
  { key: "paystack", name: "Paystack", meta: "Nigeria · Instant payout" },
  { key: "flutterwave", name: "Flutterwave", meta: "Pan-Africa · 1-2 hours" },
];

export default function PaymentPartners() {
  const [selected, setSelected] = useState("paystack");

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
        Payment Partners
      </h3>

      <div className="flex flex-col gap-3">
        {partners.map((partner) => {
          const isSelected = selected === partner.key;
          return (
            <button
              key={partner.key}
              type="button"
              onClick={() => setSelected(partner.key)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                isSelected ?
                  "border-[#DE814A] bg-[#F2DFC8]"
                : "border-[#E5E0D6] bg-white hover:border-[#DE814A]"
              }`}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 ${
                  isSelected ? "border-[#A8531E]" : "border-[#C9C2B4]"
                }`}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A8531E]" />
                )}
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#1F2A22]">
                  {partner.name}
                </span>
                <span className="block text-xs text-[#8A8A7E]">
                  {partner.meta}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
