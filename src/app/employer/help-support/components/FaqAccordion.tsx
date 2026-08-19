"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I know a freelancer is genuinely verified?",
    answer:
      "Every verified freelancer completes identity verification through either a checked LinkedIn profile or Didit's automated ID and liveness check. You'll see an 'ID Verified' badge on their profile — this means a real person, checked against a real professional profile or government ID.",
  },
  {
    question: "How does escrow protect my payment?",
    answer:
      "When you fund a milestone, the money is held in escrow — not sent to the freelancer directly. It's only released once you approve the delivered work, so you never pay for work you haven't reviewed.",
  },
  {
    question: "What if a freelancer doesn't deliver as agreed?",
    answer:
      "If a milestone isn't delivered as agreed, you can open a dispute instead of approving the release. Our team reviews the submitted work and message history before resolving it — funds stay in escrow until the dispute is settled.",
  },
  {
    question: "What fees does TalentQ charge employers?",
    answer:
      "TalentQ charges freelancers a flat 10% service fee when a milestone payment is released. There's no separate employer-side fee on top of the amount you fund into escrow.",
  },
  {
    question: "Can I invite my team to help manage hiring?",
    answer:
      "Yes — under Profile → Team, you can add team members like hiring managers or technical leads who can review candidates and manage job posts alongside you.",
  },
  {
    question: "Can I pay freelancers outside Nigeria?",
    answer:
      "Yes — Flutterwave and Bank Transfer support payments across multiple African countries, in addition to Paystack for Nigeria-specific transfers.",
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
