"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "../components/AuthShell";
import GoogleButton from "../components/GoogleButton";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    router.push(
      profile?.role === "employer" ? "/employer/dashboard" : "/dashboard",
    );
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
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#C6543A] font-medium hover:underline"
            >
              Forgot password?
            </Link>
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
        <span className="text-xs text-[#9AA79F]">OR</span>
        <div className="flex-1 h-px bg-black/10" />
      </div>

      <GoogleButton label="Continue with Google" onClick={handleGoogleLogin} />

      <p className="text-sm text-[#6B7A73] text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#C6543A] font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
