"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import PostJobStepper from "./components/PostJobStepper";
import JobDetailsStep from "./components/JobDetailsStep";
import RequirementsStep from "./components/RequirementsStep";
import CompensationStep from "./components/CompensationStep";
import PreviewStep from "./components/PreviewStep";
import { createClient } from "@/lib/supabase/client";
import { createJob } from "@/lib/queries/postJob";

type JobDetailsData = {
  title: string;
  jobType: string;
  workArrangement: string;
  department: string;
  description: string;
};

type RequirementsData = {
  experienceLevel: string;
  yearsOfExperience: string;
  skills: string[];
  preferredQualifications: string;
};

type CompensationData = {
  currency: string;
  minBudget: string;
  maxBudget: string;
  experienceLevel: string;
  projectDuration: string;
  paymentType: string;
  applicationDeadline: string;
};

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [jobDetails, setJobDetails] = useState<JobDetailsData>({
    title: "",
    jobType: "Full-time",
    workArrangement: "Remote",
    department: "",
    description: "",
  });
  const [requirements, setRequirements] = useState<RequirementsData>({
    experienceLevel: "Entry Level",
    yearsOfExperience: "",
    skills: [],
    preferredQualifications: "",
  });
  const [compensation, setCompensation] = useState<CompensationData>({
    currency: "USD",
    minBudget: "",
    maxBudget: "",
    experienceLevel: "Entry Level",
    projectDuration: "",
    paymentType: "Fixed price",
    applicationDeadline: "",
  });

  const canContinueStep1 = jobDetails.title && jobDetails.description;
  const canContinueStep2 = requirements.skills.length > 0;
  const canContinueStep3 = compensation.minBudget && compensation.maxBudget;

  const handlePost = async () => {
    setPosting(true);
    setPostError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPostError("You must be logged in to post a job.");
      setPosting(false);
      return;
    }

    const { error, jobId } = await createJob(
      user.id,
      jobDetails,
      requirements,
      compensation,
    );

    setPosting(false);

    if (error || !jobId) {
      setPostError(error ?? "Something went wrong posting this job.");
      return;
    }

    router.push(`/employer/candidates?posted=${jobId}`);
  };

  return (
    <div>
      <PostJobStepper current={step} />

      {step === 1 && (
        <JobDetailsStep data={jobDetails} onChange={setJobDetails} />
      )}
      {step === 2 && (
        <RequirementsStep data={requirements} onChange={setRequirements} />
      )}
      {step === 3 && (
        <CompensationStep data={compensation} onChange={setCompensation} />
      )}
      {step === 4 && (
        <PreviewStep
          title={jobDetails.title}
          workArrangement={jobDetails.workArrangement}
          jobType={jobDetails.jobType}
          department={jobDetails.department}
          currency={compensation.currency}
          minBudget={compensation.minBudget}
          maxBudget={compensation.maxBudget}
          skills={requirements.skills}
          description={jobDetails.description}
        />
      )}

      {postError && (
        <p className="text-sm text-[#C6543A] bg-[#FBEBE9] rounded-lg px-4 py-2.5 mt-4">
          {postError}
        </p>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 rounded-full border border-[#DE814A] px-5 py-2.5 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {step < 4 ?
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={
              (step === 1 && !canContinueStep1) ||
              (step === 2 && !canContinueStep2) ||
              (step === 3 && !canContinueStep3)
            }
            className="flex items-center gap-2 rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight size={14} />
          </button>
        : <button
            type="button"
            onClick={handlePost}
            disabled={posting}
            className="flex items-center gap-2 rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-60"
          >
            <Check size={14} />
            {posting ? "Posting..." : "Post Job"}
          </button>
        }
      </div>
    </div>
  );
}
