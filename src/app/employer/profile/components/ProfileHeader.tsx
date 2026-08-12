import Image from "next/image";
import { MapPin, ShieldCheck, Link2, Briefcase, Star } from "lucide-react";

const badges = [
  { label: "ID Verified", color: "#3E7AC7", bg: "#DCE9F7", icon: ShieldCheck },
  { label: "Payment Connected", color: "#3E8E5A", bg: "#DDEEE2", icon: Link2 },
  {
    label: "Employment Verified",
    color: "#C755A0",
    bg: "#F7DFEF",
    icon: Briefcase,
  },
  { label: "Client Reviewed", color: "#DE814A", bg: "#FBEADB", icon: Star },
];

const stats = [
  { value: "12", label: "Project Posted" },
  { value: "4.9★", label: "Avg Talent Rating" },
  { value: "$45-65", label: "Avg Rate Range" },
  { value: "98%", label: "Response Rate" },
];

export default function ProfileHeader() {
  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#3E5C50] overflow-hidden shrink-0">
            <Image
              src="/images/testimonials/edgar.png"
              alt="Edgar John"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1F2A22]">Edgar John</h1>
            <p className="text-sm text-[#8A8A7E]">Technology Company</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#8A8A7E]">
              <MapPin size={12} />
              <span>Lagos, Nigeria, Remote</span>
              <span className="mx-1">·</span>
              <span className="flex items-center gap-1 text-[#3E8E5A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8E5A]" />
                Available
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full border border-[#E5E0D6] px-4 py-2 text-sm font-medium text-[#1F2A22] hover:bg-[#F5F1E9] transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {badges.map((badge) => (
          <span
            key={badge.label}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            <badge.icon size={12} />
            {badge.label}
          </span>
        ))}
      </div>

      <div className="border-t border-[#EFEBE2] pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-base font-bold text-[#1F2A22]">{stat.value}</p>
            <p className="text-xs text-[#8A8A7E]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
