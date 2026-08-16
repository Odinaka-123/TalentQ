"use client";

import { useState } from "react";
import OnboardingStepper from "./components/OnboardingStepper";
import RoleStep from "./components/RoleStep";
import { createClient } from "@/lib/supabase/client";

type Role = "employer" | "freelancer";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <OnboardingStepper
        step={step}
        totalSteps={TOTAL_STEPS}
        backHref="/signup"
      />

      {step === 1 && (
        <RoleStep
          selected={role}
          onSelect={setRole}
          onContinue={handleRoleContinue}
        />
      )}
      {step === 2 && (
        <div className="text-center text-sm text-[#8A8A7E] py-10">
          Step 2 — coming next
        </div>
      )}
      {step === 3 && (
        <div className="text-center text-sm text-[#8A8A7E] py-10">
          Step 3 — coming next
        </div>
      )}
      {step === 4 && (
        <div className="text-center text-sm text-[#8A8A7E] py-10">
          Step 4 — coming next
        </div>
      )}

      {saving && (
        <p className="text-xs text-[#8A8A7E] text-center mt-3">Saving...</p>
      )}
    </div>
  );
}
