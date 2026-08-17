import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import Avatar from "@/components/Avatar";

type ProfileHeaderProps = {
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    identity_verified: boolean;
  };
  details: {
    headline: string | null;
    hourly_rate: number | null;
    years_experience: number | null;
    country: string | null;
    availability: string | null;
  } | null;
};

export default function ProfileHeader({
  profile,
  details,
}: ProfileHeaderProps) {
  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div className="flex items-center gap-4">
          <Avatar src={profile.avatar_url} name={profile.full_name} size={64} />
          <div>
            <h1 className="text-lg font-bold text-[#1F2A22]">
              {profile.full_name ?? "Unnamed"}
            </h1>
            <p className="text-sm text-[#8A8A7E]">
              {details?.headline ?? "No headline set"}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#8A8A7E]">
              <MapPin size={12} />
              <span>{details?.country ?? "Location not set"}</span>
              {details?.availability === "available" && (
                <>
                  <span className="mx-1">·</span>
                  <span className="flex items-center gap-1 text-[#3E8E5A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E8E5A]" />
                    Available
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/profile/setup"
          className="rounded-full border border-[#E5E0D6] px-4 py-2 text-sm font-medium text-[#1F2A22] hover:bg-[#F5F1E9] transition-colors"
        >
          Edit Profile
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {profile.identity_verified && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCE9F7] px-3 py-1 text-xs font-medium text-[#3E7AC7]">
            <ShieldCheck size={12} />
            ID Verified
          </span>
        )}
      </div>

      <div className="border-t border-[#EFEBE2] pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-base font-bold text-[#1F2A22]">
            {details?.hourly_rate ? `$${details.hourly_rate}/hr` : "—"}
          </p>
          <p className="text-xs text-[#8A8A7E]">Hourly Rate</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-[#1F2A22]">
            {details?.years_experience ?? "—"}
          </p>
          <p className="text-xs text-[#8A8A7E]">Years Experience</p>
        </div>
      </div>
    </div>
  );
}
