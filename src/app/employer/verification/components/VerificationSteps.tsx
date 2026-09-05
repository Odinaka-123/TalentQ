"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getEmployerVerificationStatus } from "@/lib/queries/employerVerification";

type StepState = "completed" | "pending" | "locked";
type StepKey = "company" | "linkedin" | "review";

type VerificationStepsProps = {
  refreshKey: number;
  onOpenStep: (step: "company" | "linkedin") => void;
};

export default function VerificationSteps({
  refreshKey,
  onOpenStep,
}: VerificationStepsProps) {
  const [loading, setLoading] = useState(true);
  const [companyStatus, setCompanyStatus] = useState<StepState>("locked");
  const [linkedInStatus, setLinkedInStatus] = useState<StepState>("locked");
  const [reviewStatus, setReviewStatus] = useState<StepState>("locked");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const result = await getEmployerVerificationStatus(user.id);
      setCompanyStatus(
        result.companyRegistrationStatus === "verified" ? "completed"
        : result.companyRegistrationStatus === "pending" ? "pending"
        : "locked",
      );
      setLinkedInStatus(
        result.linkedInStatus === "verified" ? "completed"
        : result.linkedInStatus === "pending" ? "pending"
        : "locked",
      );
      setReviewStatus(result.employerReviewed ? "completed" : "locked");
      setLoading(false);
    };
    load();
  }, [refreshKey]);

  const steps: {
    key: StepKey;
    number: number;
    title: string;
    description: string;
    state: StepState;
    clickable: boolean;
  }[] = [
    {
      key: "company",
      number: 1,
      title: "Company Registration",
      description: "Upload your business certificate or registration document",
      state: companyStatus,
      clickable: companyStatus !== "completed",
    },
    {
      key: "linkedin",
      number: 2,
      title: "LinkedIn Verification",
      description: "Connect your company LinkedIn page to confirm legitimacy.",
      state: linkedInStatus,
      clickable: linkedInStatus !== "completed",
    },
    {
      key: "review",
      number: 3,
      title: "Employer Review",
      description:
        "Receive your first talent review after a completed contract.",
      state: reviewStatus,
      clickable: false, // earned automatically, nothing to open
    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E8A47E] bg-white h-64 animate-pulse mb-6" />
    );
  }

  return (
    <div className="rounded-2xl border border-[#E8A47E] bg-white px-6 py-6 mb-6">
      <h3 className="text-base font-semibold text-[#1F2A22]">
        Verification Steps
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-5">
        Complete each step independently — order doesn&apos;t matter.
      </p>

      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {steps.map((step) => {
          const Wrapper = step.clickable ? "button" : "div";
          return (
            <Wrapper
              key={step.key}
              type={step.clickable ? "button" : undefined}
              onClick={
                step.clickable && step.key !== "review" ?
                  () => onOpenStep(step.key as "company" | "linkedin")
                : undefined
              }
              className={`flex items-center justify-between gap-4 py-4 text-left w-full ${
                step.clickable ?
                  "hover:bg-[#F5F1E9] -mx-2 px-2 rounded-lg transition-colors"
                : ""
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {step.state === "completed" ?
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3E8E5A] text-white shrink-0">
                    <Check size={13} />
                  </span>
                : <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 ${
                      step.state === "pending" ?
                        "bg-[#A8531E] text-white"
                      : "bg-[#F2DFC8] text-[#DE814A]"
                    }`}
                  >
                    {step.number}
                  </span>
                }
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1F2A22]">
                    {step.title}
                  </p>
                  <p className="text-xs text-[#8A8A7E]">{step.description}</p>
                </div>
              </div>

              {step.state === "completed" && (
                <span className="rounded-full bg-[#DDEEE2] px-3 py-1 text-xs text-[#3E8E5A] shrink-0">
                  Completed
                </span>
              )}
              {step.state === "pending" && (
                <span className="rounded-full bg-[#FBEADB] px-3 py-1 text-xs text-[#DE814A] shrink-0">
                  In Review
                </span>
              )}
              {step.state === "locked" && (
                <span className="rounded-full bg-[#F2DFC8] px-3 py-1 text-xs text-[#DE814A] shrink-0">
                  Not started
                </span>
              )}
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
