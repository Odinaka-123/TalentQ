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
import { getFreelancerDashboard } from "@/lib/queries/dashboard";

export default function DashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getFreelancerDashboard>
  > | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const result = await getFreelancerDashboard(user.id);
      setData(result);
      setLoading(false);
    };

    load();
  }, [supabase]);

  if (loading || !data) {
    return (
      <div className="text-center py-16 text-sm text-[#6B7A73]">
        Loading dashboard...
      </div>
    );
  }

  const stats = [
    {
      label: "Active Contracts",
      value: data.stats.activeContracts.toString(),
      icon: Briefcase,
      bg: "bg-[#E3F2E8]",
      fg: "text-[#2F8C4D]",
    },
    {
      label: "Pending Payments",
      value: `$${data.stats.pendingPayments.toLocaleString()}`,
      icon: Wallet,
      bg: "bg-[#FCEFE3]",
      fg: "text-[#D97757]",
    },
    {
      label: "Proposals Sent",
      value: data.stats.proposalsSent.toString(),
      icon: FileText,
      bg: "bg-[#FBE9EE]",
      fg: "text-[#D45C82]",
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
        <div className="bg-[#FFF2E4] border border-[#DE814A] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D97757] font-semibold text-sm">
              <ShieldCheck size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1B3A2F]">
                {data.verificationStatus === "pending" ?
                  "Verification Pending Review"
                : "Identity Verification Needed"}
              </p>
              <p className="text-xs text-[#6B7A73] mt-0.5">
                Complete it to appear in more searches and unlock expert-level
                jobs.
              </p>
            </div>
          </div>
          <Link
            href="/verification"
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
                  <p className="text-xs text-[#6B7A73] mt-0.5">{c.client}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5">
          <h2 className="text-base font-semibold text-[#1B3A2F]">
            Recommended for You
          </h2>
          <p className="text-xs text-[#6B7A73] mb-4">
            Based on your skills and activity
          </p>
          {data.recommended.length === 0 ?
            <p className="text-sm text-[#6B7A73] py-4">
              Add skills to your profile to see job matches here.
            </p>
          : <div className="flex flex-col divide-y divide-[#F0ECE3]">
              {data.recommended.map((job) => (
                <div
                  key={job.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1B3A2F] truncate">
                      {job.title}
                    </p>
                    <p className="text-xs text-[#6B7A73] mt-0.5">
                      {job.minBudget && job.maxBudget ?
                        `$${job.minBudget}–$${job.maxBudget}`
                      : "Budget not set"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-[#2F8C4D] bg-[#E3F2E8] px-2.5 py-1 rounded-full">
                    {job.matchScore}% Match
                  </span>
                </div>
              ))}
            </div>
          }
          <Link
            href="/find-jobs"
            className="mt-4 flex items-center gap-1 text-sm font-medium text-[#C6543A] hover:gap-1.5 transition-all w-fit"
          >
            Browse all matches
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5">
          <h2 className="text-base font-semibold text-[#1B3A2F] mb-4">
            Recent Activity
          </h2>
          {data.activity.length === 0 ?
            <p className="text-sm text-[#6B7A73]">No recent activity yet.</p>
          : <ul className="flex flex-col gap-3">
              {data.activity.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6543A] mt-1.5 shrink-0" />
                  <p className="text-sm text-[#3E4C46]">{item}</p>
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
    </div>
  );
}
