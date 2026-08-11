"use client";

import { useState } from "react";
import WithdrawConfirm from "./WithdrawConfirm";

type Method = {
  key: string;
  name: string;
  meta: string;
};

const methods: Method[] = [
  { key: "paystack", name: "Paystack", meta: "Nigeria · Instant payout" },
  { key: "flutterwave", name: "Flutterwave", meta: "Pan-Africa · 1-2 hours" },
  { key: "bank", name: "Bank Transfer", meta: "1-3 business days" },
];

const availableBalance = 2020.5;

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("paystack");
  const [step, setStep] = useState<"form" | "confirm">("form");

  const numericAmount = Number(amount) || 0;
  const selected = methods.find((m) => m.key === selectedMethod);

  if (step === "confirm") {
    return (
      <WithdrawConfirm
        amount={numericAmount}
        methodName={selected?.name ?? ""}
        onBack={() => setStep("form")}
        onConfirm={() => {
          // TODO: call withdrawal API, then show a success state
          setStep("form");
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#1F2A22] mb-2">
          Withdrawal Amount
        </h2>
        <p className="text-xs text-[#8A8A7E] mb-3">
          Available:{" "}
          <span className="text-[#C6543A] font-medium">
            ${availableBalance.toFixed(2)}
          </span>
        </p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          max={availableBalance}
          className="w-full max-w-xs rounded-lg border border-[#E5E0D6] bg-white px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:max-w-xl rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
            Withdrawal Method
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
            onClick={() => setStep("confirm")}
            className="w-full rounded-full border border-[#DE814A] bg-[#FBF0E4] py-3 text-sm font-medium text-[#C6543A] hover:bg-[#F2DFC8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to confirm
          </button>
        </div>

        <div className="w-full lg:max-w-sm rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
            Withdrawal Summary
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8A8A7E]">Amount</span>
              <span className="text-[#1F2A22] font-medium">
                ${numericAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8A7E]">Withdrawal fee</span>
              <span className="text-[#3E8E5A] font-medium">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8A7E]">Method</span>
              <span className="text-[#1F2A22] font-medium">
                {selected?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8A7E]">Est. arrival</span>
              <span className="text-[#1F2A22] font-medium">
                {selected?.meta.split("·")[1]?.trim()}
              </span>
            </div>

            <div className="border-t border-[#EFEBE2] my-2" />

            <div className="flex justify-between">
              <span className="text-[#1F2A22] font-semibold">
                You&apos;ll receive
              </span>
              <span className="text-[#C6543A] font-semibold">
                ${numericAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#8A8A7E] mt-4">
            Withdrawals carry no additional fee beyond TalentQ&apos;s 10%
            service rate already applied to your earnings.
          </p>
        </div>
      </div>
    </div>
  );
}
