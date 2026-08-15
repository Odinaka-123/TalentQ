"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(
      `/verify-otp?email=${encodeURIComponent(email)}&type=recovery&next=/reset-password`,
    );
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a code to reset it."
    >
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7A73] hover:text-[#1B3A2F] -mt-2 mb-4"
      >
        <ArrowLeft size={15} />
        Back to log in
      </Link>

      {error && (
        <p className="text-sm text-[#C6543A] bg-[#FBEBE9] rounded-lg px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-[#1B3A2F]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-[#A8531E] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#732700] transition-colors disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset code"}
        </button>
      </form>

      <p className="text-sm text-[#6B7A73] text-center mt-6">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-[#C6543A] font-medium hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
