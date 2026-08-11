import {
  Briefcase,
  Wallet,
  FileText,
  Eye,
  ShieldCheck,
  ArrowRight,
  Clock,
  Lock,
} from "lucide-react";

const stats = [
  {
    label: "Active Jobs",
    value: "4",
    icon: Briefcase,
    bg: "bg-[#E3F2E8]",
    fg: "text-[#2F8C4D]",
  },
  {
    label: "This Month",
    value: "$8,450",
    icon: Wallet,
    bg: "bg-[#E8F0FE]",
    fg: "text-[#3B82F6]",
  },
  {
    label: "Applications",
    value: "38",
    icon: FileText,
    bg: "bg-[#FCEFE3]",
    fg: "text-[#D97757]",
  },
  {
    label: "Profile Views",
    value: "214",
    icon: Eye,
    bg: "bg-[#EFE8FB]",
    fg: "text-[#8A5FD6]",
  },
];

const hiringActivity = [
  { label: "Post 2 more jobs", points: 8 },
  { label: "Complete skills brief", points: 12 },
  { label: "Get first talent review", points: 8 },
];

const recommendedCandidates = [
  { name: "Henrieta Ebiuwa", rate: "$45/hr", match: "94% AI Match" },
  { name: "Chidi Obiekwe", rate: "$38/hr", match: "87% AI Match" },
  { name: "Farida Zahra", rate: "$32/hr", match: "91% AI Match" },
];

const contracts = [
  {
    title: "SEO Content — Techpulse Media",
    freelancer: "Techpulse Media",
    amount: "$1,800",
    due: "Due Aug 2",
  },
  {
    title: "React Dashboard for PocketFund",
    freelancer: "PocketFund · Verified",
    amount: "$1,800",
    due: "Due Aug 2",
  },
];

export default function EmployerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
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

      {/* Employer verification banner */}
      <div className="bg-[#FCEFE3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D97757] font-semibold text-sm">
            <ShieldCheck size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1B3A2F]">
              Employer Verification Pending
            </p>
            <p className="text-xs text-[#6B7A73] mt-0.5">
              Complete your setup to unlock AI-powered matching.
            </p>
          </div>
        </div>
        <button className="shrink-0 bg-[#C6543A] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#B24932] transition-colors self-start sm:self-auto">
          Continue
        </button>
      </div>

      {/* Hiring activity */}
      <div className="bg-white rounded-2xl p-4 sm:p-5">
        <div className="flex items-baseline gap-2 mb-3">
          <h2 className="text-base font-semibold text-[#1B3A2F]">
            Hiring Activity
          </h2>
          <span className="text-xs font-medium text-[#C6543A]">
            {hiringActivity.length} actions to improve
          </span>
        </div>
        <div className="flex flex-col divide-y divide-[#F0ECE3]">
          {hiringActivity.map((item) => (
            <div
              key={item.label}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
            >
              <p className="text-sm text-[#1B3A2F]">{item.label}</p>
              <span className="text-sm font-medium text-[#C6543A] shrink-0">
                +{item.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended for you */}
      <div className="bg-[#FCEFE3] border border-[#E8B98F] rounded-2xl p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[#1B3A2F]">
          Recommended for You
        </h2>
        <p className="text-xs text-[#6B7A73] mb-4">
          Based on your job posts and hiring activity
        </p>
        <div className="flex flex-col divide-y divide-[#EFDDC5]">
          {recommendedCandidates.map((candidate) => (
            <div
              key={candidate.name}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1B3A2F] truncate">
                  {candidate.name}
                </p>
                <p className="text-xs text-[#6B7A73] mt-0.5">
                  {candidate.rate}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-[#C6543A] bg-white px-2.5 py-1 rounded-full">
                {candidate.match}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-1 text-sm font-medium text-[#C6543A] hover:gap-1.5 transition-all">
          Browse all matches
          <ArrowRight size={14} />
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
              className="bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1B3A2F]">{c.title}</p>
                <p className="text-xs text-[#6B7A73] mt-0.5">{c.freelancer}</p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <p className="text-sm font-semibold text-[#1B3A2F]">
                  {c.amount}
                </p>
                <span className="flex items-center gap-1 text-[11px] text-[#9AA79F]">
                  <Clock size={11} />
                  {c.due}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#2F8C4D] bg-[#E3F2E8] px-2 py-0.5 rounded-full">
                  <Lock size={10} />
                  Escrow Protected
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
