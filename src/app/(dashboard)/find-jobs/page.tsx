"use client";

import { useRouter } from "next/navigation";
import { Award } from "lucide-react";
import JobCard, { type Job } from "../components/JobCard";

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    badges: ["Top Applicant", "Senior Preferred"],
    client: "Cloudburst Technologies",
    location: "Remote - Worldwide",
    postedAgo: "3d ago",
    proposals: 13,
    tags: ["TypeScript", "Node.js", "React", "GraphQL"],
    priceRange: "$4,000-6,000",
    duration: "3 months",
    level: "Expert",
  },
  {
    id: "2",
    title: "UX Designer for Fintech App",
    badges: ["Top Applicant", "Senior Preferred"],
    client: "FinaGrowth",
    location: "Remote - African Preferred",
    postedAgo: "18h ago",
    proposals: 7,
    tags: ["Prototyping", "User Research", "Figma"],
    priceRange: "$2,500-3,500",
    duration: "6 weeks",
    level: "Intermediate",
  },
  {
    id: "3",
    title: "Blog Content Writer — Tech & AI",
    badges: ["10% Match", "Senior Preferred"],
    client: "Techysta Media",
    location: "Remote - Global",
    postedAgo: "1d ago",
    proposals: 24,
    tags: ["Content Writing", "Research", "SEO"],
    priceRange: "$300-500",
    duration: "Ongoing",
    level: "Beginner",
  },
  {
    id: "4",
    title: "Data Analyst — Growth & Retention",
    badges: ["27% Match", "Senior Preferred"],
    client: "PulseChart",
    location: "Remote - African Preferred",
    postedAgo: "5d ago",
    proposals: 7,
    tags: ["TypeScript", "Node.js", "React", "GraphQL"],
    priceRange: "$3,000-4,500",
    duration: "2 months",
    level: "Intermediate",
  },
  {
    id: "5",
    title: "Virtual Assistant for E-commerce Brand",
    badges: ["Top Applicant", "Senior Preferred"],
    client: "Nudia Cosmetics",
    location: "Remote - Global",
    postedAgo: "9h ago",
    proposals: 12,
    tags: ["Admin Support", "Shopify", "E-mail Management"],
    priceRange: "$800-900/month",
    duration: "Long term",
    level: "Beginner",
  },
  {
    id: "6",
    title: "Digital Marketing Specialist",
    badges: ["Top Applicant", "Senior Preferred"],
    client: "Orbit Labs",
    location: "Remote - Global",
    postedAgo: "2d ago",
    proposals: 19,
    tags: ["Content Writing", "Meta Ads/Google Ads"],
    priceRange: "$2,000-3,000",
    duration: "3 months",
    level: "Intermediate",
  },
];

export default function FindJobsPage() {
  const router = useRouter();

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
              2 jobs reserved for new freelancers — lower competition,
              beginner-friendly.
            </p>
          </div>
        </div>
        <button className="shrink-0 bg-white border border-[#C6543A] text-[#C6543A] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#C6543A] hover:text-white transition-colors">
          View First Gigs
        </button>
      </div>

      <p className="text-sm text-[#6B7A73] mb-3">
        {jobs.length} jobs match your profile
      </p>

      <div className="flex flex-col gap-3 sm:gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={(j) => router.push(`/find-jobs/${j.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
