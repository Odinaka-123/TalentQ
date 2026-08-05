import {
  Briefcase,
  Wallet,
  FileText,
  Eye,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    label: "Active Contracts",
    value: "2",
    icon: Briefcase,
    bg: "bg-[#E3F2E8]",
    fg: "text-[#2F8C4D]",
  },
  {
    label: "Pending Payments",
    value: "$2,250",
    icon: Wallet,
    bg: "bg-[#FCEFE3]",
    fg: "text-[#D97757]",
  },
  {
    label: "Proposals Sent",
    value: "8",
    icon: FileText,
    bg: "bg-[#FBE9EE]",
    fg: "text-[#D45C82]",
  },
  {
    label: "Profile Views",
    value: "139",
    icon: Eye,
    bg: "bg-[#EFE8FB]",
    fg: "text-[#8A5FD6]",
  },
];

const contracts = [
  {
    title: "React Dashboard for PocketFund",
    client: "PocketFund · Verified",
    amount: "$1,800",
    progress: 70,
  },
  {
    title: "SEO Content — Techpulse Media",
    client: "Techpulse Media",
    amount: "$450",
    progress: 100,
  },
];

const recommended = [
  { title: "Senior React Developer", pay: "$2,500–$4,500", match: "94% Match" },
  {
    title: "UX Designer for Fintech App",
    pay: "$2,500–$3,600",
    match: "91% Match",
  },
  {
    title: "Blog Content Writer — Tech AI",
    pay: "$300–$700",
    match: "78% Match",
  },
];

const activity = [
  "Kasari Foods sent you a message about revisions.",
  "Milestone 1 for Mobile banking app was approved.",
  "Your profile was viewed by 139 employers this week.",
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
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

      {/* Skills verification banner */}
      <div className="bg-[#FCEFE3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D97757] font-semibold text-sm">
            <ShieldCheck size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1B3A2F]">
              Skills Verification Pending
            </p>
            <p className="text-xs text-[#6B7A73] mt-0.5">
              Complete it to appear in more searches and unlock expert-level
              jobs.
            </p>
          </div>
        </div>
        <button className="shrink-0 bg-[#C6543A] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#B24932] transition-colors self-start sm:self-auto">
          Continue
        </button>
      </div>

      {/* Active contracts */}
      <div>
        <h2 className="text-base font-semibold text-[#1B3A2F] mb-3">
          Active Contracts
        </h2>
        <div className="flex flex-col gap-3">
          {contracts.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-[#1B3A2F]">
                    {c.title}
                  </p>
                  <p className="text-sm font-semibold text-[#1B3A2F] shrink-0">
                    {c.amount}
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
      </div>

      {/* Recommended + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5">
          <h2 className="text-base font-semibold text-[#1B3A2F]">
            Recommended for You
          </h2>
          <p className="text-xs text-[#6B7A73] mb-4">
            Based on your skills and activity
          </p>
          <div className="flex flex-col divide-y divide-[#F0ECE3]">
            {recommended.map((job) => (
              <div
                key={job.title}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1B3A2F] truncate">
                    {job.title}
                  </p>
                  <p className="text-xs text-[#6B7A73] mt-0.5">{job.pay}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-[#2F8C4D] bg-[#E3F2E8] px-2.5 py-1 rounded-full">
                  {job.match}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1 text-sm font-medium text-[#C6543A] hover:gap-1.5 transition-all">
            Browse all matches
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5">
          <h2 className="text-base font-semibold text-[#1B3A2F] mb-4">
            Recent Activity
          </h2>
          <ul className="flex flex-col gap-3">
            {activity.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6543A] mt-1.5 shrink-0" />
                <p className="text-sm text-[#3E4C46]">{item}</p>
              </li>
            ))}
          </ul>
          <button className="mt-4 text-sm font-medium text-[#C6543A] hover:underline">
            View all
          </button>
        </div>
      </div>
    </div>
  );
}
