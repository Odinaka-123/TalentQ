"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Wallet,
  FileText,
  Eye,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getEmployerDashboard,
  type EmployerDashboardData,
} from "@/lib/queries/employer-dashboard";

export default function EmployerDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EmployerDashboardData | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const result = await getEmployerDashboard(user.id);
      setData(result);
      setLoading(false);
    };

    load();
  }, [supabase]);

  if (loading || !data) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EDEAE1]" />
              <div>
                <div className="h-6 w-14 rounded bg-[#EDEAE1] mb-2" />
                <div className="h-3 w-20 rounded bg-[#F0ECE3]" />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="h-4 w-32 rounded bg-[#EDEAE1] mb-3" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-4 w-40 rounded bg-[#EDEAE1]" />
                  <div className="h-4 w-16 rounded bg-[#EDEAE1]" />
                </div>
                <div className="h-3 w-24 rounded bg-[#F0ECE3] mt-2" />
                <div className="h-1.5 rounded-full bg-[#F0ECE3] mt-3" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5">
          <div className="h-4 w-40 rounded bg-[#EDEAE1] mb-2" />
          <div className="h-3 w-52 rounded bg-[#F0ECE3] mb-4" />
          <div className="flex flex-col divide-y divide-[#F0ECE3]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="h-4 w-3/4 rounded bg-[#EDEAE1] mb-2" />
                  <div className="h-3 w-24 rounded bg-[#F0ECE3]" />
                </div>
                <div className="h-5 w-16 rounded-full bg-[#EDEAE1] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Active Jobs",
      value: data.stats.activeJobs.toString(),
      icon: Briefcase,
      bg: "bg-[#E3F2E8]",
      fg: "text-[#2F8C4D]",
    },
    {
      label: "This Month",
      value: `$${data.stats.spendThisMonth.toLocaleString()}`,
      icon: Wallet,
      bg: "bg-[#E8F0FE]",
      fg: "text-[#3B82F6]",
    },
    {
      label: "Applications",
      value: data.stats.applicationsReceived.toString(),
      icon: FileText,
      bg: "bg-[#FCEFE3]",
      fg: "text-[#D97757]",
    },
    {
      label: "Profile Views",
      value: data.stats.profileViews.toString(),
      icon: Eye,
      bg: "bg-[#EFE8FB]",
      fg: "text-[#8A5FD6]",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg} ${stat.fg}`}
            >
              <stat.icon size={17} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-[#1B3A2F]">
                {stat.value}
              </p>
              <p className="text-xs text-[#6B7A73] mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {data.verificationStatus !== "verified" && (
        <div className="bg-[#FCEFE3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D97757] font-semibold text-sm">
              <ShieldCheck size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1B3A2F]">
                {data.verificationStatus === "pending" ?
                  "Verification Pending Review"
                : "Employer Verification Needed"}
              </p>
              <p className="text-xs text-[#6B7A73] mt-0.5">
                Complete your setup to unlock AI-powered matching.
              </p>
            </div>
          </div>
          <Link
            href="/employer/verification"
            className="shrink-0 bg-[#C6543A] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#B24932] transition-colors self-start sm:self-auto"
          >
            Continue
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-[#1B3A2F] mb-3">
          Active Contracts
        </h2>
        {data.activeContracts.length === 0 ?
          <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#6B7A73]">
            No active contracts yet.
          </div>
        : <div className="flex flex-col gap-3">
            {data.activeContracts.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-[#1B3A2F]">
                      {c.title}
                    </p>
                    <p className="text-sm font-semibold text-[#1B3A2F] shrink-0">
                      ${c.amount.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-[#6B7A73] mt-0.5">
                    {c.freelancerName}
                  </p>
                  <div className="mt-3 h-1.5 rounded-full bg-[#F0ECE3] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C6543A]"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#9AA79F] mt-1.5">
                    {c.progress}% Complete
                  </p>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      <div className="bg-[#FCEFE3] border border-[#E8B98F] rounded-2xl p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[#1B3A2F]">
          Recommended for You
        </h2>
        <p className="text-xs text-[#6B7A73] mb-4">
          Based on your job posts and hiring activity
        </p>
        {data.recommended.length === 0 ?
          <p className="text-sm text-[#6B7A73] py-4">
            No new applicants to review right now.
          </p>
        : <div className="flex flex-col divide-y divide-[#EFDDC5]">
            {data.recommended.map((candidate) => (
              <Link
                key={candidate.applicationId}
                href={`/employer/candidates/${candidate.applicationId}`}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1B3A2F] truncate">
                    {candidate.freelancerName}
                  </p>
                  <p className="text-xs text-[#6B7A73] mt-0.5">
                    {candidate.jobTitle}
                  </p>
                </div>
                {candidate.matchScore !== null && (
                  <span className="shrink-0 text-xs font-medium text-[#C6543A] bg-white px-2.5 py-1 rounded-full">
                    {candidate.matchScore}% AI Match
                  </span>
                )}
              </Link>
            ))}
          </div>
        }
        <Link
          href="/employer/candidates"
          className="mt-4 flex items-center gap-1 text-sm font-medium text-[#C6543A] hover:gap-1.5 transition-all w-fit"
        >
          Browse all matches
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
