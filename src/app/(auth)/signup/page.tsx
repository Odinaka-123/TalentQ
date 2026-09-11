"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react";
import AuthShell from "../components/AuthShell";
import GoogleButton from "../components/GoogleButton";
import { createClient } from "@/lib/supabase/client";
import { getPasswordChecks, isPasswordValid } from "@/lib/validation/password";

export default function SignupPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordChecks = getPasswordChecks(form.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(form.password)) {
      setError("Password doesn't meet the minimum requirements");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(
        `/verify-otp?email=${encodeURIComponent(form.email)}&type=signup&next=/onboarding`,
      );
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join TalentQ to hire or get hired across Africa."
    >
      {error && (
        <p className="text-sm text-[#C6543A] bg-[#FBEBE9] rounded-lg px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-[#1B3A2F]">
            {t("app_auth_signup_page.full_name")}</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="mt-1.5 w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-[#1B3A2F]">
            {t("app_auth_signup_page.email")}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="mt-1.5 w-full bg-[#F5F1E9] rounded-lg px-3.5 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-[#1B3A2F]"
          >
            {t("app_auth_signup_page.password")}</label>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              placeholder="Create a password"
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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-black/10" />
        <span className="text-xs text-[#9AA79F]">{t("app_auth_signup_page.or")}</span>
        <div className="flex-1 h-px bg-black/10" />
      </div>

      <GoogleButton label="Sign up with Google" onClick={handleGoogleSignup} />

      <p className="text-sm text-[#6B7A73] text-center mt-6">
        {t("app_auth_signup_page.already_have_an_account")}{" "}
        <Link
          href="/login"
          className="text-[#C6543A] font-medium hover:underline"
        >
          {t("app_auth_signup_page.log_in")}</Link>
      </p>
    </AuthShell>
  );
}
