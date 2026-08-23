"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, User, Star } from "lucide-react";
import Image from "next/image";
import {
  getFreelancerPublicProfile,
  type FreelancerPublicProfile,
} from "@/lib/queries/freelancer-public-profile";

export default function TalentProfilePage({
  params,
}: {
  params: Promise<{ freelancerId: string }>;
}) {
  const { freelancerId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FreelancerPublicProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getFreelancerPublicProfile(freelancerId);
      setProfile(result);
      setLoading(false);
    };
    load();
  }, [freelancerId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 rounded-2xl bg-white mb-4" />
        <div className="h-64 rounded-2xl bg-white" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16 text-sm text-[#8A8A7E]">
        Profile not found.
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/employer/find-talent"
        className="inline-flex items-center gap-1.5 text-xs text-[#C6543A] font-medium hover:underline mb-3"
      >
        <ArrowLeft size={12} />
        Back to Search
      </Link>

      <div className="rounded-2xl border border-[#DE814A] bg-white px-6 py-5 mb-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-[#3E5C50] overflow-hidden shrink-0 relative flex items-center justify-center">
            {profile.avatarUrl ?
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                className="object-cover"
              />
            : <User size={22} className="text-white/70" />}
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1F2A22]">{profile.name}</h1>
            <p className="text-sm text-[#C6543A] font-medium">
              {profile.headline}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {profile.identityVerified && (
                <span className="flex items-center gap-1 text-xs text-[#DE814A]">
                  <ShieldCheck size={12} />
                  Identity and skills verified
                </span>
              )}
              {profile.overallRating !== null && (
                <span className="flex items-center gap-1 text-xs text-[#1F2A22] font-medium">
                  <Star size={12} className="fill-[#DE814A] text-[#DE814A]" />
                  {profile.overallRating.toFixed(1)} ({profile.reviews.length})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/employer/messages?conversation=${profile.freelancerId}`,
              )
            }
            className="rounded-full border border-[#DE814A] px-4 py-2 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors"
          >
            Send message
          </button>
          {/* TODO: "Make an Offer" — still pending the contracts.job_id
              nullability decision flagged earlier */}
        </div>
      </div>

      {profile.skills.length > 0 && (
        <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 mb-4">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#FBEADB] px-3 py-1.5 text-xs text-[#DE814A]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.portfolio.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-3">
            Portfolio
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.portfolio.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E5E0D6] bg-white overflow-hidden"
              >
                <div className="w-full h-36 bg-[#F5F1E9] relative">
                  {item.image_url && (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="px-4 py-3 border-t-2 border-[#DE814A]">
                  <p className="text-sm font-semibold text-[#C6543A]">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.reviews.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-3">Reviews</h3>
          <div className="flex flex-col gap-3">
            {profile.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-5"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-sm font-semibold text-[#1F2A22]">
                    {review.employerName}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < review.rating ?
                            "fill-[#DE814A] text-[#DE814A]"
                          : "fill-[#E5E0D6] text-[#E5E0D6]"
                        }
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-[#5C5347]">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
