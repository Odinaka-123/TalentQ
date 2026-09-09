"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type InvitePreview = {
  valid: boolean;
  email?: string;
  role?: string;
  companyName?: string;
  error?: string;
};

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setPreview({ valid: false, error: "No invite token provided." });
        setLoading(false);
        return;
      }

      const [previewRes, supabase] = await Promise.all([
        fetch(`/api/team/accept?token=${token}`).then((r) => r.json()),
        Promise.resolve(createClient()),
      ]);

      setPreview(previewRes);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentEmail(user?.email ?? null);
      setLoading(false);
    };

    load();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError(null);

    try {
      const res = await fetch("/api/team/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not accept invite");
      router.push("/employer/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 size={28} className="animate-spin text-[#DE814A] mb-3" />
        <p className="text-sm text-[#8A8A7E]">Loading invite…</p>
      </div>
    );
  }

  if (!preview?.valid) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <XCircle size={28} className="text-[#C6543A] mb-3" />
        <p className="text-sm font-medium text-[#1F2A22]">
          {preview?.error ?? "This invite link is invalid."}
        </p>
      </div>
    );
  }

  const isSignedIn = currentEmail !== null;
  const emailMatches =
    isSignedIn && currentEmail?.toLowerCase() === preview.email?.toLowerCase();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#E5E0D6] bg-white p-6">
        <CheckCircle2 size={28} className="text-[#3E8E5A] mb-3 mx-auto" />
        <h1 className="text-base font-semibold text-[#1F2A22] mb-1">
          Join {preview.companyName} on TalentQ
        </h1>
        <p className="text-sm text-[#8A8A7E] mb-5">
          Invited as <strong>{preview.role}</strong> · {preview.email}
        </p>

        {error && <p className="text-xs text-[#C6543A] mb-3">{error}</p>}

        {!isSignedIn && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-[#8A8A7E] mb-1">
              Sign in or create an account with {preview.email}, then return to
              this link to finish joining.
            </p>
            <Link
              href={`/login?redirectTo=/team/accept?token=${token}`}
              className="rounded-full bg-[#A8531E] py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={`/signup?redirectTo=/team/accept?token=${token}`}
              className="rounded-full border border-[#DE814A] py-2.5 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors"
            >
              Create Account
            </Link>
          </div>
        )}

        {isSignedIn && !emailMatches && (
          <p className="text-xs text-[#C6543A]">
            This invite was sent to {preview.email}, but you&apos;re signed in
            as {currentEmail}. Sign out and sign in with the invited email to
            continue.
          </p>
        )}

        {isSignedIn && emailMatches && (
          <button
            type="button"
            onClick={handleAccept}
            disabled={accepting}
            className="w-full rounded-full bg-[#A8531E] py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {accepting && <Loader2 size={14} className="animate-spin" />}
            {accepting ? "Joining…" : "Accept Invite"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInviteContent />
    </Suspense>
  );
}