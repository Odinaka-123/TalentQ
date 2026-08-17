"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SetupStepper from "./components/SetupStepper";
import BasicInfoStep from "./components/BasicInfoStep";
import RateExperienceStep from "./components/RateExperienceStep";
import LocationAvailabilityStep from "./components/LocationAvailabilityStep";
import SetupSuccessStep from "./components/SetupSuccessStep";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 3;

export default function ProfileSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [basicInfo, setBasicInfo] = useState({ fullName: "", headline: "" });
  const [rateExperience, setRateExperience] = useState({
    hourlyRate: "",
    yearsExperience: "",
  });
  const [locationAvailability, setLocationAvailability] = useState({
    country: "",
    availability: "",
  });

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const [profileRes, detailsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single(),
        supabase
          .from("freelancer_details")
          .select(
            "headline, hourly_rate, years_experience, country, availability",
          )
          .eq("id", user.id)
          .single(),
      ]);

      setBasicInfo({
        fullName: profileRes.data?.full_name ?? "",
        headline: detailsRes.data?.headline ?? "",
      });
      setRateExperience({
        hourlyRate: detailsRes.data?.hourly_rate?.toString() ?? "",
        yearsExperience: detailsRes.data?.years_experience?.toString() ?? "",
      });
      setLocationAvailability({
        country: detailsRes.data?.country ?? "",
        availability: detailsRes.data?.availability ?? "available",
      });

      setLoading(false);
    };

    load();
  }, [supabase, router]);

  const handleBasicInfoContinue = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ full_name: basicInfo.fullName })
        .eq("id", user.id);

      await supabase
        .from("freelancer_details")
        .upsert({ id: user.id, headline: basicInfo.headline });
    }

    setSaving(false);
    setStep(2);
  };

  const handleRateContinue = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("freelancer_details").upsert({
        id: user.id,
        hourly_rate: Number(rateExperience.hourlyRate) || null,
        years_experience: Number(rateExperience.yearsExperience) || null,
      });
    }

    setSaving(false);
    setStep(3);
  };

  const handleFinalSave = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("freelancer_details").upsert({
        id: user.id,
        country: locationAvailability.country,
        availability: locationAvailability.availability,
      });
    }

    setSaving(false);
    setStep(4);
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      {step < 4 && (
        <SetupStepper
          step={step}
          totalSteps={TOTAL_STEPS}
          onBack={() =>
            step > 1 ? setStep((s) => s - 1) : router.push("/profile")
          }
        />
      )}

      {step === 1 && (
        <BasicInfoStep
          data={basicInfo}
          onChange={setBasicInfo}
          onContinue={handleBasicInfoContinue}
        />
      )}
      {step === 2 && (
        <RateExperienceStep
          data={rateExperience}
          onChange={setRateExperience}
          onContinue={handleRateContinue}
        />
      )}
      {step === 3 && (
        <LocationAvailabilityStep
          data={locationAvailability}
          onChange={setLocationAvailability}
          onContinue={handleFinalSave}
        />
      )}
      {step === 4 && (
        <SetupSuccessStep onDone={() => router.push("/profile")} />
      )}

      {saving && (
        <p className="text-xs text-[#8A8A7E] text-center mt-3">Saving...</p>
      )}
    </div>
  );
}
