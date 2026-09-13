"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { getPasswordChecks, isPasswordValid } from "@/lib/validation/password";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordChecks = getPasswordChecks(password);

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasSession(Boolean(session));
      setCheckingSession(false);
    };
    check();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(password)) {
      setError("Password doesn't meet the minimum requirements");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        return;
      }

      // Sign out everywhere so the recovery session can't linger or be
      // reused after the password has been changed — the person has to
      // log back in fresh with the new password.
      await supabase.auth.signOut({ scope: "global" });
      router.push("/login?passwordReset=1");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <AuthShell title="Reset your password" subtitle="One moment…">
        <div />
      </AuthShell>
    );
  }

  if (!hasSession) {
    return (
      <AuthShell
        title="Reset link expired"
        subtitle="This password reset link is invalid or has expired."
      >
        <Link
          href="/forgot-password"
          className="block w-full text-center bg-[#A8531E] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#732700] transition-colors"
        >
          Request a new reset link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Choose a new password for your account."
    >
      {error && (
        <p className="text-sm text-[#C6543A] bg-[#FBEBE9] rounded-lg px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-[#1B3A2F]"
          >
            New password
          </label>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              placeholder="Create a new password"
              className="w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 pr-10 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA79F] hover:text-[#1B3A2F]"
            >
              {showPassword ?
                <EyeOff size={16} />
              : <Eye size={16} />}
            </button>
          </div>

          {passwordFocused && (
            <ul className="mt-2 flex flex-col gap-1">
              {passwordChecks.map((check) => (
                <li
                  key={check.label}
                  className={`flex items-center gap-1.5 text-xs ${
                    check.met ? "text-[#3E8E5A]" : "text-[#9AA79F]"
                  }`}
                >
                  {check.met ?
                    <Check size={12} />
                  : <X size={12} />}
                  {check.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-[#A8531E] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#732700] transition-colors disabled:opacity-60"
        >
          {loading ? "Updating..." : "Reset password"}
        </button>
      </form>
    </AuthShell>
  );
}
