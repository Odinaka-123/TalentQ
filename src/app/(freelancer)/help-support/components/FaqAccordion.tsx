"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does identity verification work?",
    answer:
      "We verify your identity using a LinkedIn-based check against your professional profile. Once approved, a verified badge appears on your profile and unlocks payments.",
  },
  {
    question: "When do I actually get paid?",
    answer:
      "Clients fund milestones into escrow upfront. Once you deliver the work and the client approves it, funds are released to your TalentQ wallet automatically.",
  },
  {
    question: "What fees does TalentQ charge?",
    answer:
      "TalentQ takes a flat 10% service fee when a milestone payment is released to your wallet. Withdrawing that money out to Paystack, Flutterwave, or your bank carries no additional fee.",
  },
  {
    question: "What happens if a client doesn't approve my work?",
    answer:
      "If there's a disagreement over a delivered milestone, either side can open a dispute. Our team reviews the submitted work and messages before resolving it.",
  },
  {
    question: "Can I withdraw to a bank account outside Nigeria?",
    answer:
      "Yes — Flutterwave and Bank Transfer support withdrawals across multiple African countries, in addition to Paystack for Nigeria-specific instant payouts.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-5 sm:px-6 py-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
        Frequently Asked Questions
      </h3>

      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="py-4">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium text-[#1F2A22]">
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#8A8A7E] shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="text-sm text-[#8A8A7E] mt-3 max-w-2xl">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
