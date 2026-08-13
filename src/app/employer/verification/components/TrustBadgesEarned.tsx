import { ShieldCheck } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Wallet, Star } from "lucide-react";

type Badge = {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  earned: boolean;
};

const badges: Badge[] = [
  {
    icon: ShieldCheck,
    iconBg: "#3E7AC7",
    iconColor: "#ffffff",
    label: "ID verified",
    earned: true,
  },
  {
    icon: FaLinkedin,
    iconBg: "#3E8E5A",
    iconColor: "#ffffff",
    label: "LinkedIn verified",
    earned: true,
  },
  {
    icon: Wallet,
    iconBg: "#D9D3C5",
    iconColor: "#8A8A7E",
    label: "Payment connected",
    earned: false,
  },
  {
    icon: Star,
    iconBg: "#D9D3C5",
    iconColor: "#8A8A7E",
    label: "Client Reviewed",
    earned: false,
  },
];

export default function TrustBadgesEarned() {
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
              style={{ backgroundColor: badge.iconBg }}
            >
              <badge.icon size={13} color={badge.iconColor} />
            </span>
            <span
              className={`text-xs font-medium ${
                badge.earned ? "text-[#1F2A22]" : "text-[#8A8A7E]"
              }`}
            >
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
