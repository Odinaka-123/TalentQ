"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { submitSupportTicket } from "@/lib/queries/supportTickets";

const categories = [
  "General",
  "Payments",
  "Contracts",
  "Verification",
  "Technical",
];

export default function SupportTicketForm() {
  const supabase = createClient();
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You need to be signed in to submit a ticket.");
        return;
      }

      await submitSupportTicket(user.id, { category, subject, message });
      setSubmitted(true);
      setSubject("");
      setMessage("");
      setCategory("General");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit your ticket.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#DDEEE2] bg-[#F3FAF5] px-6 py-10 text-center">
        <p className="text-sm font-semibold text-[#2E6B44] mb-1">
          Ticket submitted
        </p>
        <p className="text-xs text-[#5C8A6B] mb-4">
          We&apos;ll follow up by email within 4 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs font-medium text-[#2E6B44] hover:underline"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

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

      <div className="mb-4">
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

      {error && <p className="text-xs text-[#FF363A] mb-4">{error}</p>}

      <button
        type="submit"
        disabled={!subject || !message || submitting}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}
