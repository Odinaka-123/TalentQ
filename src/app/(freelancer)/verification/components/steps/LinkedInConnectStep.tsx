"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import ProgressBar from "../ProgressBar";
import { createClient } from "@/lib/supabase/client";

type LinkedInConnectStepProps = {
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
};

type Status = "idle" | "connecting" | "error" | "submitted";

const permissions = [
  "Your name and profile photo",
  "Your headline and current position",
  "Profile completeness (used to assess authenticity)",
];

export default function LinkedInConnectStep({
  totalSteps,
  onBack,
  onContinue,
}: LinkedInConnectStepProps) {
  const [status, setStatus] = useState<Status>("idle");

  const handleConnect = async () => {
    setStatus("connecting");

    const supabase = createClient();
    const { error } = await supabase.auth.linkIdentity({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/verification?linkedin=connected`,
      },
    });

    if (error) {
      console.error("LinkedIn link failed:", error);
      setStatus("error");
      return;
    }

    // On success the browser navigates away to LinkedIn immediately, so
    // nothing after this point actually runs — the "connecting" view stays
    // up until that navigation happens. The user lands back on
    // /verification?linkedin=connected once they approve, which
    // VerificationHero handles (submits the profile + refreshes status).
  };

  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <Loader2 size={32} className="text-[#DE814A] animate-spin mb-5" />
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          Connecting to LinkedIn
        </h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs">
          Redirecting you to LinkedIn to approve access.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBE9E5] mb-5">
          <Clock size={26} className="text-[#C6543A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          Couldn&apos;t connect to LinkedIn
        </h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          Something went wrong starting the connection. Please try again.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBEADB] mb-5">
          <Clock size={26} className="text-[#DE814A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F2A22] mb-1">
          Profile submitted for review
        </h2>
        <p className="text-sm text-[#8A8A7E] max-w-xs mb-6">
          Your LinkedIn profile has been sent to our team. We typically review
          identity submissions within 24 hours — you&apos;ll see your status
          update here once it&apos;s done.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          Continue to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="text-[#8A8A7E] hover:text-[#1F2A22] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <ProgressBar step={1} totalSteps={totalSteps} />
        </div>
        <span className="text-xs text-[#8A8A7E] shrink-0">
          Step 1 of {totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DCE9F7] mx-auto mb-5">
        <FaLinkedin size={26} className="text-[#3E7AC7]" />
      </div>

      <h2 className="text-xl font-bold text-[#1F2A22] text-center mb-2">
        Connect your LinkedIn
      </h2>
      <p className="text-sm text-[#8A8A7E] text-center max-w-xs mx-auto mb-6">
        We&apos;ll send your profile to our team to confirm it&apos;s real
        before marking your identity as verified.
      </p>

      <div className="rounded-xl border border-[#E5E0D6] px-4 py-4 mb-6">
        <p className="text-xs font-medium text-[#1F2A22] mb-3">
          TalentQ will access:
        </p>
        <div className="flex flex-col gap-2">
          {permissions.map((permission) => (
            <div key={permission} className="flex items-start gap-2">
              <CheckCircle2
                size={14}
                className="text-[#3E8E5A] shrink-0 mt-0.5"
              />
              <span className="text-xs text-[#5C5347]">{permission}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleConnect}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] py-3 text-sm font-medium text-white hover:bg-[#095196] transition-colors"
      >
        <FaLinkedin size={16} />
        Continue with LinkedIn
      </button>

      <p className="text-xs text-[#8A8A7E] text-center mt-3">
        If your profile doesn&apos;t meet our verification criteria, you&apos;ll
        be asked to verify with Didit instead.
      </p>
    </div>
  );
}
