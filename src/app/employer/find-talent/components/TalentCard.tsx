import Link from "next/link";
import {
  Sparkles,
  Lock,
  CheckCircle2,
  MapPin,
  Clock,
  Users,
} from "lucide-react";

type TalentCardProps = {
  href: string;
  matchScore: number;
  name: string;
  status: "Available" | "Busy";
  location: string;
  availability: string;
  proposals: number;
  skills: string[];
  rate: string;
  rateUnit: string;
  level: "Expert" | "Intermediate" | "Beginner";
};

const levelStyles: Record<
  TalentCardProps["level"],
  { bg: string; color: string }
> = {
  Expert: { bg: "#F7DFEF", color: "#C755A0" },
  Intermediate: { bg: "#DCE9F7", color: "#3E7AC7" },
  Beginner: { bg: "#DDEEE2", color: "#3E8E5A" },
};

export default function TalentCard({
  href,
  matchScore,
  name,
  status,
  location,
  availability,
  proposals,
  skills,
  rate,
  rateUnit,
  level,
}: TalentCardProps) {
  const levelStyle = levelStyles[level];

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[#E5E0D6] bg-white px-5 py-4 hover:border-[#DE814A] transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#DDEEE2] px-2.5 py-1 text-xs font-medium text-[#3E8E5A]">
            <Sparkles size={11} />
            {matchScore}% AI Match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F1E9] px-2.5 py-1 text-xs text-[#5C5347]">
            <Lock size={11} />
            Escrow Protected
          </span>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-[#1F2A22]">
            {rate}
            <span className="text-xs font-normal text-[#8A8A7E]">
              /{rateUnit}
            </span>
          </p>
          <span
            className="inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: levelStyle.bg, color: levelStyle.color }}
          >
            {level}
          </span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-[#1F2A22] mb-1.5">{name}</h3>

      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A8A7E] mb-3">
        <span className="flex items-center gap-1 text-[#3E8E5A]">
          <CheckCircle2 size={12} />
          {status}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {availability}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {proposals} Proposals
        </span>
      </div>

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
    </Link>
  );
}
