"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "../components/AuthShell";
import GoogleButton from "../components/GoogleButton";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up real signup (API call / auth provider) here
    router.push("/onboarding");
  };

  const handleGoogleSignup = () => {
    // TODO: trigger Google OAuth flow
    router.push("/onboarding");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join TalentQ to hire or get hired across Africa."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-[#1B3A2F]">
            Full name
          </label>
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
          <label
            htmlFor="password"
            className="text-sm font-medium text-[#1B3A2F]"
          >
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
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
          <p className="text-xs text-[#9AA79F] mt-1.5">
            Must be at least 8 characters.
          </p>
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-[#A8531E] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#732700] transition-colors"
        >
          Create account
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-black/10" />
        <span className="text-xs text-[#9AA79F]">OR</span>
        <div className="flex-1 h-px bg-black/10" />
      </div>

      <GoogleButton label="Sign up with Google" onClick={handleGoogleSignup} />

      <p className="text-sm text-[#6B7A73] text-center mt-6">
        Already have an account?{" "}
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
