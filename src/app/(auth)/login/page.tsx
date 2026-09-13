"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Clock } from "lucide-react";
import AuthShell from "../components/AuthShell";
import GoogleButton from "../components/GoogleButton";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordReset = searchParams.get("passwordReset") === "1";
  const sessionExpired = searchParams.get("sessionExpired") === "1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (!data.onboardingCompleted) {
        router.push("/onboarding");
        return;
      }

      router.push(data.role === "employer" ? "/employer/dashboard" : "/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue to TalentQ.">
      {passwordReset && (
        <p className="flex items-center gap-2 text-sm text-[#3E8E5A] bg-[#EAF6EC] rounded-lg px-3.5 py-2.5 mb-4">
          <CheckCircle2 size={16} className="shrink-0" />
          Your password has been reset. Log in with your new password.
        </p>
      )}

      {sessionExpired && !passwordReset && (
        <p className="flex items-center gap-2 text-sm text-[#8A6D1F] bg-[#FBF3DE] rounded-lg px-3.5 py-2.5 mb-4">
          <Clock size={16} className="shrink-0" />
          You were logged out due to inactivity. Please log in again.
        </p>
      )}

      {error && (
        <p className="text-sm text-[#C6543A] bg-[#FBEBE9] rounded-lg px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-[#1B3A2F]">
            {t("app_auth_login_page.email")}</label>
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#1B3A2F]"
            >
              {t("app_auth_login_page.password")}</label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#C6543A] font-medium hover:underline"
            >
              {t("app_auth_login_page.forgot_password")}</Link>
          </div>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-[#A8531E] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#732700] transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-black/10" />
        <span className="text-xs text-[#9AA79F]">{t("app_auth_login_page.or")}</span>
        <div className="flex-1 h-px bg-black/10" />
      </div>

      <GoogleButton label="Continue with Google" onClick={handleGoogleLogin} />

      <p className="text-sm text-[#6B7A73] text-center mt-6">
        {t("app_auth_login_page.don_t_have_an_account")}{" "}
        <Link
          href="/signup"
          className="text-[#C6543A] font-medium hover:underline"
        >
          {t("app_auth_login_page.sign_up")}</Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
