import Image from "next/image";
import { MapPin, ShieldCheck } from "lucide-react";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
  identity_verification_status: string | null;
};

type EmployerDetails = {
  company_name: string | null;
  industry: string | null;
  country: string | null;
  company_size: string | null;
  budget_range: string | null;
  hiring_categories: string[] | null;
} | null;

type ProfileHeaderProps = {
  profile: Profile;
  details: EmployerDetails;
  onEdit: () => void;
};

export default function ProfileHeader({
  profile,
  details,
  onEdit,
}: ProfileHeaderProps) {
  const isIdVerified = profile.identity_verification_status === "verified";

  const badges = [
    isIdVerified && {
      label: "ID Verified",
      color: "#3E7AC7",
      bg: "#DCE9F7",
      icon: ShieldCheck,
    },
    // TODO: Payment Connected / Employment Verified / Client Reviewed
    // badges depend on data we haven't wired yet (payout_accounts
    // status, a review-count threshold) — left out rather than
    // shown as always-true placeholders.
  ].filter(Boolean) as {
    label: string;
    color: string;
    bg: string;
    icon: typeof ShieldCheck;
  }[];

  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#3E5C50] overflow-hidden shrink-0 relative">
            {profile.avatar_url && (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name ?? "Company logo"}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1F2A22]">
              {profile.full_name ?? "Unnamed"}
            </h1>
            <p className="text-sm text-[#8A8A7E]">
              {details?.company_name ?? "Company name not set"}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#8A8A7E]">
              <MapPin size={12} />
              <span>{details?.country ?? "Location not set"}</span>
              {details?.industry && (
                <>
                  <span className="mx-1">·</span>
                  <span>{details.industry}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-[#E5E0D6] px-4 py-2 text-sm font-medium text-[#1F2A22] hover:bg-[#F5F1E9] transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {badges.length > 0 && (
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
      )}

    </div>
  );
}
