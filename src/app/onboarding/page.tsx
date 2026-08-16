"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingStepper from "./components/OnboardingStepper";
import RoleStep from "./components/RoleStep";
import CompanyStep from "./components/CompanyStep";
import HiringCategoriesStep from "./components/HiringCategoriesStep";
import OnboardingSuccessStep from "./components/OnboardingSuccessStep";
import { createClient } from "@/lib/supabase/client";

type Role = "employer" | "freelancer";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");

  const [companyData, setCompanyData] = useState({
    companyName: "",
    industry: "",
    country: "",
  });

  const [hiringCategories, setHiringCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setFullName(user.user_metadata?.full_name ?? "");
      }
    };
    loadUser();
  }, [supabase]);

  const handleRoleContinue = async () => {
    if (!role) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("profiles").update({ role }).eq("id", user.id);
    }

    setSaving(false);
    setStep(2);
  };

  const handleCompanyContinue = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("employer_details").upsert({
        id: user.id,
        company_name: companyData.companyName,
        industry: companyData.industry,
        country: companyData.country,
      });
    }

    setSaving(false);
    setStep(3);
  };

  const handleCategoriesContinue = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("employer_details")
        .update({ hiring_categories: hiringCategories })
        .eq("id", user.id);
    }

    setSaving(false);
    setStep(4);
  };

  const handleSkipCategories = () => {
    setStep(4);
  };

  const handleGoToDashboard = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user.id);
    }

    setSaving(false);
    router.push(role === "employer" ? "/employer/dashboard" : "/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      {step < 4 && (
        <OnboardingStepper
          step={step}
          totalSteps={TOTAL_STEPS}
          onBack={step > 1 ? () => setStep((s) => s - 1) : undefined}
          backHref={step === 1 ? "/signup" : undefined}
        />
      )}

      {step === 1 && (
        <RoleStep
          selected={role}
          onSelect={setRole}
          onContinue={handleRoleContinue}
        />
      )}

      {step === 2 && role === "employer" && (
        <CompanyStep
          data={companyData}
          onChange={setCompanyData}
          onContinue={handleCompanyContinue}
        />
      )}

      {step === 2 && role === "freelancer" && (
        <div className="text-center text-sm text-[#8A8A7E] py-10">
          Freelancer Step 2 — coming next
        </div>
      )}

      {step === 3 && role === "employer" && (
        <HiringCategoriesStep
          selected={hiringCategories}
          onChange={setHiringCategories}
          onContinue={handleCategoriesContinue}
          onSkip={handleSkipCategories}
        />
      )}

      {step === 3 && role === "freelancer" && (
        <div className="text-center text-sm text-[#8A8A7E] py-10">
          Freelancer Step 3 — coming next
        </div>
      )}

      {step === 4 && (
        <OnboardingSuccessStep
          name={fullName || "there"}
          onGoToDashboard={handleGoToDashboard}
        />
      )}

      {saving && (
        <p className="text-xs text-[#8A8A7E] text-center mt-3">Saving...</p>
      )}
    </div>
  );
}
