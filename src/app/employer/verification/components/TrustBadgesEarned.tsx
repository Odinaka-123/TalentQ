"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Wallet, Star } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { getEmployerVerificationStatus } from "@/lib/queries/employerVerification";

export default function TrustBadgesEarned({ refreshKey }: { refreshKey: number }) {
  const [loading, setLoading] = useState(true);
  const [linkedInEarned, setLinkedInEarned] = useState(false);
  const [companyEarned, setCompanyEarned] = useState(false);
  const [reviewEarned, setReviewEarned] = useState(false);

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
      setCompanyEarned(result.companyRegistrationStatus === "verified");
      setLinkedInEarned(result.linkedInStatus === "verified");
      setReviewEarned(result.employerReviewed);
      setLoading(false);
    };
    load();
  }, [refreshKey]);

  const badges = [
    {
      icon: ShieldCheck,
      iconBg: "#3E7AC7",
      label: "Company verified",
      earned: companyEarned,
    },
    {
      icon: FaLinkedin,
      iconBg: "#3E8E5A",
      label: "LinkedIn verified",
      earned: linkedInEarned,
    },
    {
      icon: Wallet,
      iconBg: "#D9D3C5",
      label: "Payment connected",
      earned: false,
    },
    {
      icon: Star,
      iconBg: "#D9D3C5",
      label: "Client Reviewed",
      earned: reviewEarned,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white h-24 animate-pulse" />
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
        Trust Badges Earned
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${
              badge.earned ?
                "border-[#DDEEE2] bg-white"
              : "border-[#EFEBE2] bg-[#F5F1E9]"
            }`}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
              style={{
                backgroundColor: badge.earned ? badge.iconBg : "#D9D3C5",
              }}
            >
              <badge.icon size={13} color="#ffffff" />
            </span>
            <span
              className={`text-xs font-medium ${badge.earned ? "text-[#1F2A22]" : "text-[#8A8A7E]"}`}
            >
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
