"use client";

import { Building2, MapPin, Clock, Users } from "lucide-react";

export type JobLevel = "Beginner" | "Intermediate" | "Expert";

export interface Job {
  id: string;
  title: string;
  badges?: string[]; 
  client: string;
  location: string; 
  postedAgo: string; 
  proposals: number;
  tags: string[];
  priceRange: string; 
  duration: string; 
  level: JobLevel;
}

const levelStyles: Record<JobLevel, string> = {
  Beginner: "bg-[#FCEFE3] text-[#D97757]",
  Intermediate: "bg-[#E3F0FC] text-[#3A7FC6]",
  Expert: "bg-[#EFE8FB] text-[#8A5FD6]",
};

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(job)}
      className="w-full text-left bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border border-black/5 hover:border-[#C6543A]/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {job.badges?.map((badge) => (
            <span
              key={badge}
              className="text-[11px] font-medium px-2 py-1 rounded-full bg-[#F5F1E9] text-[#6B7A73]"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-end shrink-0">
          <p className="text-sm sm:text-base font-semibold text-[#1B3A2F]">
            {job.priceRange}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] text-[#9AA79F]">{job.duration}</span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${levelStyles[job.level]}`}
            >
              {job.level}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-[#1B3A2F]">
        {job.title}
      </h3>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B7A73]">
        <span className="flex items-center gap-1.5">
          <Building2 size={13} />
          {job.client}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={13} />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} />
          {job.postedAgo}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={13} />
          {job.proposals} Proposals
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full bg-[#F5F1E9] text-[#4B5C55]"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
