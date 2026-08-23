// VerificationClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { submitLinkedInVerification } from "@/lib/queries/verification";
import VerificationHero from "./VerificationHero";
import VerificationSteps from "./VerificationSteps";
import TrustBadgesEarned from "./TrustBadgesEarned";
import VerificationModal from "./VerificationModal";
import CompanyRegistrationStep from "./steps/CompanyRegistrationStep";
import LinkedInStep from "./steps/LinkedlnStep";
import PaymentMethodStep from "./steps/PaymentMethodStep";

type ActiveModal = "company" | "linkedin" | "payment" | null;

export default function VerificationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    load();
  }, []);

  // Handles the redirect back from LinkedIn — runs regardless of which
  // modal was open before the user got sent away.
  useEffect(() => {
    if (searchParams.get("linkedin") !== "connected") return;

    async function completeLinkedInSubmission() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const linkedInIdentity = user.identities?.find(
        (i) => i.provider === "linkedin_oidc",
      );
      if (linkedInIdentity) {
        const identityData = linkedInIdentity.identity_data ?? {};
        await submitLinkedInVerification(user.id, {
          name: (identityData.name as string) ?? user.email ?? "",
          photoUrl: identityData.picture as string | undefined,
        });
      }

      setRefreshKey((k) => k + 1);
      router.replace("/employer/verification");
    }

    completeLinkedInSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const closeModal = () => {
    setActiveModal(null);
    setRefreshKey((k) => k + 1); // re-fetch status so Steps/Badges reflect any change
  };

  return (
    <div>
      <VerificationHero onStart={() => setActiveModal("company")} />

      <VerificationSteps refreshKey={refreshKey} onOpenStep={setActiveModal} />

      <TrustBadgesEarned refreshKey={refreshKey} />

      <VerificationModal open={activeModal === "company"} onClose={closeModal}>
        {userId && (
          <CompanyRegistrationStep
            totalSteps={1}
            userId={userId}
            onBack={closeModal}
            onContinue={closeModal}
          />
        )}
      </VerificationModal>

      <VerificationModal open={activeModal === "linkedin"} onClose={closeModal}>
        <LinkedInStep
          totalSteps={1}
          onBack={closeModal}
          onContinue={closeModal}
        />
      </VerificationModal>

      <VerificationModal open={activeModal === "payment"} onClose={closeModal}>
        <PaymentMethodStep onBack={closeModal} />
      </VerificationModal>
    </div>
  );
}
