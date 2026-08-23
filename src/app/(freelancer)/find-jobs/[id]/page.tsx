"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getJobById,
  applyToJob,
  type JobDetail,
} from "@/lib/queries/jobDetail";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const jobId = params.id as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      const result = await getJobById(jobId, user.id);
      setJob(result);
      setLoading(false);
    };

    load();
  }, [jobId, supabase]);

  const handleApply = async () => {
    if (!userId) return;
    setApplying(true);
    setError(null);

    const result = await applyToJob(jobId, userId);

    if (result.error) {
      setError(result.error);
      setApplying(false);
      return;
    }

    setJob((prev) => (prev ? { ...prev, alreadyApplied: true } : prev));
    setApplying(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 w-24 rounded bg-[#E5E0D6] mb-6" />
        <div className="bg-white rounded-2xl p-6">
          <div className="h-6 w-2/3 rounded bg-[#EDEAE1] mb-3" />
          <div className="h-4 w-1/3 rounded bg-[#F0ECE3] mb-6" />
          <div className="h-24 w-full rounded bg-[#F0ECE3]" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16 text-sm text-[#6B7A73]">
        This job couldn&apos;t be found.
      </div>
    );
  }

  const isClosed = job.status !== "open";

  return (
    <div>
      <button
        onClick={() => router.push("/find-jobs")}
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7A73] hover:text-[#1B3A2F] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Find Jobs
      </button>

      <div className="bg-white rounded-2xl p-5 sm:p-6 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1B3A2F] mb-1">
              {job.title}
            </h1>
            <p className="text-sm text-[#6B7A73]">{job.client}</p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-[#1B3A2F]">
              {job.minBudget && job.maxBudget ?
                `$${job.minBudget}-${job.maxBudget}`
              : "Budget not set"}
            </p>
            <p className="text-xs text-[#9AA79F]">{job.paymentType}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-[#6B7A73] mb-5">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {job.duration} · {job.jobType}
          </span>
          {job.applicationDeadline && (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> Apply by{" "}
              {new Date(job.applicationDeadline).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F5F1E9] px-3 py-1 text-xs text-[#5C5347]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-[#F0ECE3] pt-5">
          <h2 className="text-sm font-semibold text-[#1B3A2F] mb-2">
            Job Description
          </h2>
          <p className="text-sm text-[#3E4C46] whitespace-pre-wrap">
            {job.description}
          </p>
        </div>
      </div>

      <p className="text-xs text-[#9AA79F] mb-4">
        {job.proposals} proposal{job.proposals === 1 ? "" : "s"} so far
      </p>

      {error && <p className="text-sm text-[#C6543A] mb-4">{error}</p>}

      {job.alreadyApplied ?
        <div className="flex items-center gap-2 rounded-full bg-[#E3F2E8] px-5 py-3 text-sm font-medium text-[#2F8C4D] w-fit">
          <CheckCircle2 size={16} />
          You&apos;ve applied to this job
        </div>
      : isClosed ?
        <div className="rounded-full bg-[#F0ECE3] px-5 py-3 text-sm font-medium text-[#9AA79F] w-fit">
          This job is no longer accepting applications
        </div>
      : <button
          onClick={handleApply}
          disabled={applying}
          className="rounded-full bg-[#A8531E] text-white text-sm font-medium px-6 py-3 hover:bg-[#94481A] transition-colors disabled:opacity-60"
        >
          {applying ? "Submitting..." : "Apply Now"}
        </button>
      }
    </div>
  );
}
