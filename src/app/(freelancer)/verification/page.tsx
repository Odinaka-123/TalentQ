"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, BadgeCheck, Briefcase, Star } from "lucide-react";
import { Suspense } from "react";
import VerificationHero from "./components/VerificationHero";
import VerificationBadgeCard from "./components/VerificationBadgeCard";
import NextStepBanner from "./components/NextStepBanner";
import ConnectPaymentMethod from "./components/ConnectPaymentMethod";
import { createClient } from "@/lib/supabase/client";
import {
  getVerificationStatus,
  type VerificationStatus,
} from "@/lib/queries/verification";

export default function VerificationPage() {
  const [identityStatus, setIdentityStatus] =
    useState<VerificationStatus>("unverified");
  const [loading, setLoading] = useState(true);

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

      const { status } = await getVerificationStatus(user.id);
      setIdentityStatus(status);
      setLoading(false);
    };

    load();
  }, []);

  const isIdentityVerified = identityStatus === "verified";

  const badges = [
    {
      icon: ShieldCheck,
      iconColor: "#3E7AC7",
      iconBg: "#DCE9F7",
      borderColor: "#DCE9F7",
      title: "Identity Verified",
      note: "3x more client invites",
      noteColor: "#3E7AC7",
      status: isIdentityVerified ? ("verified" as const) : ("pending" as const),
    },
    {
      icon: BadgeCheck,
      iconColor: "#3E8E5A",
      iconBg: "#DDEEE2",
      borderColor: "#DDEEE2",
      title: "Skills Verified",
      note: "+40% proposal win rate",
      noteColor: "#3E8E5A",
      status: "pending" as const, // no real skills-assessment system yet — see note below
    },
    {
      icon: Briefcase,
      iconColor: "#C755A0",
      iconBg: "#F7DFEF",
      borderColor: "#F7DFEF",
      title: "Employment Verified",
      note: "Preferred by 68% of employers",
      noteColor: "#C755A0",
      status: "pending" as const, // no real employment-verification system yet
    },
    {
      icon: Star,
      iconColor: "#DE814A",
      iconBg: "#FBEADB",
      borderColor: "#F2C9A0",
      title: "Client Reviewed",
      note: "Unlocks top job access",
      noteColor: "#DE814A",
      status: "pending" as const, // could be derived from reviews.count > 0 once real data exists
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2A22] mb-6">Verification</h1>

      <Suspense fallback={null}>
        <VerificationHero />
      </Suspense>

      {loading ?
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E5E0D6] h-28 animate-pulse bg-white"
            />
          ))}
        </div>
      : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {badges.map((badge) => (
            <VerificationBadgeCard key={badge.title} {...badge} />
          ))}
        </div>
      }

      <div className="mb-6">
        <NextStepBanner />
      </div>

      <ConnectPaymentMethod isIdentityVerified={isIdentityVerified} />
    </div>
  );
}
