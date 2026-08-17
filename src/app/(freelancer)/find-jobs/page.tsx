"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Check } from "lucide-react";
import JobCard from "../components/JobCard";
import { createClient } from "@/lib/supabase/client";
import {
  getJobsForFreelancer,
  type FindJobsResult,
} from "@/lib/queries/findJobs";

export default function FindJobsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [firstGigsOnly, setFirstGigsOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<FindJobsResult[]>([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const result = await getJobsForFreelancer(user.id);
      setJobs(result);
      setLoading(false);
    };

    load();
  }, [supabase]);

  const visibleJobs = firstGigsOnly ? jobs.filter((j) => j.firstGig) : jobs;
  const firstGigCount = jobs.filter((j) => j.firstGig).length;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center justify-between gap-4 bg-[#FCEFE3] border border-[#E8B98F] rounded-2xl px-5 py-4 mb-5">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-5 h-5 rounded bg-[#E8B98F] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="h-3.5 w-40 rounded bg-[#E8B98F] mb-2" />
              <div className="h-3 w-64 max-w-full rounded bg-[#F2D9BC]" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-full bg-[#E8B98F] shrink-0" />
        </div>

        <div className="h-4 w-32 rounded bg-[#E5E0D6] mb-3" />

        <div className="flex flex-col gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-black/5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-4 w-1/2 rounded bg-[#EDEAE1]" />
                <div className="h-5 w-20 rounded-full bg-[#EDEAE1] shrink-0" />
              </div>
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-16 rounded-full bg-[#F0ECE3]" />
                <div className="h-5 w-16 rounded-full bg-[#F0ECE3]" />
                <div className="h-5 w-14 rounded-full bg-[#F0ECE3]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-[#F0ECE3]" />
                <div className="h-3 w-20 rounded bg-[#F0ECE3]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 bg-[#FCEFE3] border border-[#E8B98F] rounded-2xl px-5 py-4 mb-5">
        <div className="flex items-start gap-3 min-w-0">
          <Award size={20} className="text-[#C6543A] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1B3A2F]">
              First Gig Opportunities
            </p>
            <p className="text-xs text-[#6B7A73] mt-0.5">
              {firstGigsOnly ?
                "No reviews required — lower competition, beginner-friendly."
              : `${firstGigCount} job${firstGigCount === 1 ? "" : "s"} reserved for new freelancers — lower competition, beginner-friendly.`
              }
            </p>
          </div>
        </div>
        {firstGigsOnly ?
          <button
            onClick={() => setFirstGigsOnly(false)}
            aria-pressed="true"
            aria-label="Showing first gigs only, click to show all jobs"
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-[#A8531E] text-white hover:bg-[#732700] transition-colors"
          >
            <Check size={16} />
          </button>
        : <button
            onClick={() => setFirstGigsOnly(true)}
            className="shrink-0 border border-[#C6543A] text-[#C6543A] text-sm font-medium px-4 py-2 rounded-full hover:bg-[#C6543A] hover:text-white transition-colors"
          >
            View First Gigs
          </button>
        }
      </div>

      <p className="text-sm mb-3">
        <span className="font-semibold text-[#1B3A2F]">
          {visibleJobs.length} jobs
        </span>{" "}
        <span className="text-[#6B7A73]">match your profile</span>
      </p>

      {visibleJobs.length === 0 ?
        <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#6B7A73]">
          No jobs to show right now.
        </div>
      : <div className="flex flex-col gap-3 sm:gap-4">
          {visibleJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={(j) => router.push(`/find-jobs/${j.id}`)}
            />
          ))}
        </div>
      }
    </div>
  );
}
