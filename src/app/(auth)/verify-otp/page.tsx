"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AuthShell from "../components/AuthShell";
import OtpInput from "../components/OtpInput";
import { createClient } from "@/lib/supabase/client";

function VerifyOtpForm() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const type = (searchParams.get("type") as "signup" | "recovery") ?? "signup";
  const next = searchParams.get("next") ?? "/onboarding";

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const isComplete = code.every((digit) => digit !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.join(""),
      type,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(next);
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    if (type === "signup") {
      await supabase.auth.resend({ type: "signup", email });
    } else {
      await supabase.auth.resetPasswordForEmail(email);
    }
    setSecondsLeft(60);
  };

  return (
    <AuthShell
      title="Confirm your email"
      subtitle={`We sent a 6-digit code to ${email || "your email"}.`}
    >
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7A73] hover:text-[#1B3A2F] -mt-2 mb-4"
      >
        <ArrowLeft size={15} />
        Back
      </Link>

      {error && (
        <p className="text-sm text-[#C6543A] bg-[#FBEBE9] rounded-lg px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <OtpInput value={code} onChange={setCode} />
        <button
          type="submit"
          disabled={!isComplete || loading}
          className="w-full bg-[#A8531E] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#732700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <p className="text-sm text-[#6B7A73] text-center mt-6">
        Didn&apos;t get a code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0}
          className="text-[#C6543A] font-medium hover:underline disabled:text-[#9AA79F] disabled:no-underline disabled:cursor-not-allowed"
        >
          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend code"}
        </button>
      </p>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
