"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO: wire up to a real submission endpoint (email service or a
    // contact_messages table) once one exists
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="w-full flex justify-center px-4 pb-16">
        <div className="w-full max-w-3xl rounded-3xl border border-[#DE814A] bg-white px-6 py-10 text-center">
          <p className="text-base font-semibold text-[#1F2A22] mb-1">
            Message sent!
          </p>
          <p className="text-sm text-[#8A8A7E]">
            Thanks for reaching out — our team will get back to you shortly.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex justify-center px-4 pb-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="w-full rounded-lg border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              className="w-full rounded-lg border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
              className="w-full rounded-lg border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-lg border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-medium text-[#1F2A22] mb-1.5">
              Leave a message
            </label>
            <textarea
              required
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="flex-1 min-h-[160px] w-full rounded-lg border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#A8531E] py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </section>
  );
}
