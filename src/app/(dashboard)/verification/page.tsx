import { ShieldCheck, BadgeCheck, Briefcase, Star } from "lucide-react";
import VerificationHero from "./components/VerificationHero";
import VerificationBadgeCard from "./components/VerificationBadgeCard";
import NextStepBanner from "./components/NextStepBanner";
import ConnectPaymentMethod from "./components/ConnectPaymentMethod";

const badges = [
  {
    icon: ShieldCheck,
    iconColor: "#3E7AC7",
    iconBg: "#DCE9F7",
    borderColor: "#DCE9F7",
    title: "Identity Verified",
    note: "3x more client invites",
    noteColor: "#3E7AC7",
    status: "verified" as const,
  },
  {
    icon: BadgeCheck,
    iconColor: "#3E8E5A",
    iconBg: "#DDEEE2",
    borderColor: "#DDEEE2",
    title: "Skills Verified",
    note: "+40% proposal win rate",
    noteColor: "#3E8E5A",
    status: "verified" as const,
  },
  {
    icon: Briefcase,
    iconColor: "#C755A0",
    iconBg: "#F7DFEF",
    borderColor: "#F7DFEF",
    title: "Employment Verified",
    note: "Preferred by 68% of employers",
    noteColor: "#C755A0",
    status: "verified" as const,
  },
  {
    icon: Star,
    iconColor: "#DE814A",
    iconBg: "#FBEADB",
    borderColor: "#F2C9A0",
    title: "Client Reviewed",
    note: "Unlocks top job access",
    noteColor: "#DE814A",
    status: "pending" as const,
  },
];

const isIdentityVerified = true; // TODO: replace with real status from backend

export default function VerificationPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[#1F2A22] mb-6">
        Verification
      </h1>

      <VerificationHero />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {badges.map((badge) => (
          <VerificationBadgeCard key={badge.title} {...badge} />
        ))}
      </div>

      <div className="mb-6">
        <NextStepBanner />
      </div>

      <ConnectPaymentMethod isIdentityVerified={isIdentityVerified} />
    </div>
  );
}
