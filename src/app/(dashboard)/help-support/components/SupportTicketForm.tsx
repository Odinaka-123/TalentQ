"use client";

import { useState } from "react";

const categories = [
  "General",
  "Payments",
  "Contracts",
  "Verification",
  "Technical",
];

export default function SupportTicketForm() {
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to support ticket API
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6"
    >
      <h3 className="text-base font-semibold text-[#1F2A22] mb-1">
        Submit a Support Ticket
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-6">
        For complex issues we&apos;ll follow up by email within 4 hours.
      </p>

      <div className="mb-5">
        <p className="text-sm font-medium text-[#1F2A22] mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  isActive ?
                    "bg-[#A8531E] text-white"
                  : "text-[#5C5347] hover:bg-[#F5F1E9]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-[#1F2A22] mb-2"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief summary of your issue"
          className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[#1F2A22] mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue in detail..."
          rows={4}
          className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!subject || !message}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Ticket
      </button>
    </form>
  );
}
