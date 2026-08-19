"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import PostJobStepper from "./components/PostJobStepper";
import JobDetailsStep from "./components/JobDetailsStep";
import RequirementsStep from "./components/RequirementsStep";
import CompensationStep from "./components/CompensationStep";
import PreviewStep from "./components/PreviewStep";

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
  const [step, setStep] = useState(1);
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

  const handlePost = () => {
    // TODO: submit jobDetails + requirements + compensation to Backend's Job Posting API
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
            className="flex items-center gap-2 rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
          >
            <Check size={14} />
            Post Job
          </button>
        }
      </div>
    </div>
  );
}
