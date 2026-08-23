import Link from "next/link";
import Image from "next/image";
import { Users, User } from "lucide-react";
import type { TalentListing } from "@/lib/queries/talent-directory";

export default function TalentCard({
  freelancerId,
  name,
  avatarUrl,
  headline,
  skills,
  proposalCount,
}: TalentListing) {
  return (
    <Link
      href={`/employer/find-talent/${freelancerId}`}
      className="block rounded-2xl border border-[#E5E0D6] bg-white px-5 py-4 hover:border-[#DE814A] transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#3E5C50] overflow-hidden shrink-0 relative flex items-center justify-center">
          {avatarUrl ?
            <Image src={avatarUrl} alt={name} fill className="object-cover" />
          : <User size={16} className="text-white/70" />}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#1F2A22] truncate">
            {name}
          </h3>
          <p className="text-xs text-[#8A8A7E] truncate">{headline}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-[#8A8A7E] mb-3">
        <span className="flex items-center gap-1">
          <Users size={12} />
          {proposalCount} proposal{proposalCount === 1 ? "" : "s"} sent
        </span>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#FBEADB] px-3 py-1 text-xs text-[#DE814A]"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
