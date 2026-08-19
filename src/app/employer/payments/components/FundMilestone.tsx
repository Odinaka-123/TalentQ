"use client";

import { useState } from "react";

type Method = {
  key: string;
  name: string;
  meta: string;
};

const methods: Method[] = [
  { key: "paystack", name: "Paystack", meta: "Nigeria · Instant payout" },
  { key: "flutterwave", name: "Flutterwave", meta: "Pan-Africa · 1-2 hours" },
];

const availableBalance = 2020.5;

export default function FundMilestone() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("paystack");

  const numericAmount = Number(amount) || 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#1F2A22] mb-1">
          Payments
        </h2>
        <h3 className="text-sm font-semibold text-[#1F2A22] mb-1">
          Amount to Fund
        </h3>
        <p className="text-xs text-[#8A8A7E] mb-3">
          Available:{" "}
          <span className="text-[#C6543A] font-medium">
            ${availableBalance.toFixed(2)}
          </span>
        </p>
        <div className="relative max-w-xs">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8A8A7E]">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-[#E5E0D6] pl-7 pr-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
        <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
          Payment Method
        </h3>

        <div className="flex flex-col gap-3 mb-6">
          {methods.map((method) => {
            const isSelected = selectedMethod === method.key;
            return (
              <button
                key={method.key}
                type="button"
                onClick={() => setSelectedMethod(method.key)}
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
                    {method.name}
                  </span>
                  <span className="block text-xs text-[#8A8A7E]">
                    {method.meta}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!amount || numericAmount <= 0}
          className="w-full rounded-full border border-[#DE814A] bg-[#FBF0E4] py-3 text-sm font-medium text-[#C6543A] hover:bg-[#F2DFC8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Fund Milestone
        </button>
      </div>
    </div>
  );
}
