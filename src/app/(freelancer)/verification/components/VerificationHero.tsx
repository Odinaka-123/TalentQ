"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getVerificationStatus,
  submitLinkedInVerification,
  checkDiditStatus,
  type VerificationStatus,
} from "@/lib/queries/verification";
import VerificationModal from "./VerificationModal";
import IntroStep from "./steps/IntroStep";
import IdentityStep from "./steps/IdentityStep";
import LinkedInConnectStep from "./steps/LinkedInConnectStep";
import DiditVerifyStep from "./steps/DiditVerifyStep";

type Step =
  | "intro"
  | "identity"
  | "linkedin-connect"
  | "didit-verify"
  | "portfolio";
type IdentityMethod = "linkedin" | "didit" | null;

const TOTAL_STEPS = 2;

export default function VerificationHero() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [identityMethod, setIdentityMethod] = useState<IdentityMethod>(null);

  const [status, setStatus] = useState<VerificationStatus>("unverified");
  const [statusLoading, setStatusLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const closeAndReset = () => {
    setModalOpen(false);
    setStep("intro");
    setIdentityMethod(null);
  };

  // Load the real verification status on mount — replaces the old
  // hardcoded status: "verified".
  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        setStatusLoading(false);
        return;
      }

      setUserId(user.id);
      const { status: currentStatus } = await getVerificationStatus(user.id);
      if (!cancelled) {
        setStatus(currentStatus);
        setStatusLoading(false);
      }
    }

    loadStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle the redirect back from LinkedIn (?linkedin=connected).
  // Supabase's auth.linkIdentity() sends the user back here after they
  // approve on LinkedIn's side; user.identities now includes the linked
  // account, so we read it and submit it for review.
  useEffect(() => {
    if (searchParams.get("linkedin") !== "connected") return;

    async function completeLinkedInSubmission() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);
      const linkedInIdentity = user.identities?.find(
        (identity) => identity.provider === "linkedin_oidc",
      );

      if (linkedInIdentity) {
        const identityData = linkedInIdentity.identity_data ?? {};
        await submitLinkedInVerification(user.id, {
          name: (identityData.name as string) ?? user.email ?? "",
          photoUrl: identityData.picture as string | undefined,
          // LinkedIn's basic OIDC scope doesn't return a headline — leave
          // unset unless the r_liteprofile scope gets added later.
        });
      }

      const { status: currentStatus } = await getVerificationStatus(user.id);
      setStatus(currentStatus);

      // Strip the query param so refreshing doesn't resubmit.
      router.replace("/verification");
    }

    completeLinkedInSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      {statusLoading ?
        <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 sm:px-6 py-5 mb-6 h-19 animate-pulse" />
      : status === "verified" ?
        <div className="rounded-2xl border border-[#B9DDBE] bg-[#EAF6EC] px-5 sm:px-6 py-5 flex items-center gap-3 mb-6">
          <CheckCircle2 size={18} className="text-[#2F8C4D] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#1F2A22]">
              You&rsquo;re verified.
            </p>
            <p className="text-xs text-[#5B6B60] mt-0.5">
              Your credentials are confirmed — clients see the badge on your
              profile.
            </p>
          </div>
        </div>
      : status === "pending" ?
        <div className="rounded-2xl border border-[#E8D9A7] bg-[#FBF6E4] px-5 sm:px-6 py-5 flex items-center justify-between gap-3 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-[#B08900] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#1F2A22]">
                Verification in review.
              </p>
              <p className="text-xs text-[#5B6B60] mt-0.5">
                We&rsquo;ll notify you as soon as it&rsquo;s confirmed — usually
                within 1–2 business days.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!userId) return;
              const { status: newStatus } = await checkDiditStatus(userId);
              if (newStatus) setStatus(newStatus);
            }}
            className="shrink-0 rounded-full border border-[#E8D9A7] px-4 py-2 text-xs font-medium text-[#B08900] hover:bg-[#F7EFD3] transition-colors"
          >
            Check Status
          </button>
        </div>
      : <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 sm:px-6 py-5 flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-start gap-3">
            {status === "rejected" ?
              <XCircle size={18} className="text-[#C6543A] shrink-0 mt-0.5" />
            : <ShieldCheck
                size={18}
                className="text-[#C6543A] shrink-0 mt-0.5"
              />
            }
            <div>
              <p className="text-sm font-semibold text-[#1F2A22]">
                {status === "rejected" ?
                  "Your last submission wasn't approved."
                : "Your credentials, finally respected."}
              </p>
              <p className="text-xs text-[#8A8A7E] mt-0.5">
                {status === "rejected" ?
                  "You can try again with a different verification method."
                : "African talent is already world-class. TalentQ makes it provable."
                }
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors shrink-0"
          >
            {status === "rejected" ? "Try Again" : "Start Verification"}
          </button>
        </div>
      }

      <VerificationModal open={modalOpen} onClose={closeAndReset}>
        {step === "intro" && <IntroStep onStart={() => setStep("identity")} />}
        {step === "identity" && (
          <IdentityStep
            totalSteps={TOTAL_STEPS}
            selectedMethod={identityMethod}
            onSelectMethod={setIdentityMethod}
            onBack={() => setStep("intro")}
            onContinue={() => {
              if (identityMethod === "linkedin") setStep("linkedin-connect");
              if (identityMethod === "didit") setStep("didit-verify");
            }}
          />
        )}
        {step === "linkedin-connect" && (
          <LinkedInConnectStep
            totalSteps={TOTAL_STEPS}
            onBack={() => setStep("identity")}
            onContinue={() => setStep("portfolio")}
          />
        )}
        {step === "didit-verify" && userId && (
          <DiditVerifyStep
            totalSteps={TOTAL_STEPS}
            userId={userId}
            initialStatus={status === "unverified" ? undefined : status}
            onBack={() => setStep("identity")}
            onContinue={() => setStep("portfolio")}
          />
        )}
        {step === "portfolio" && (
          <div className="text-center text-sm text-[#8A8A7E] py-10">
            Step 2 of 2 — Portfolio (coming next)
          </div>
        )}
      </VerificationModal>
    </>
  );
}
