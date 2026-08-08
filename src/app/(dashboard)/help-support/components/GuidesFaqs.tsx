import {
  ShieldCheck,
  FileEdit,
  Wallet,
  TrendingUp,
  AlertCircle,
  Globe,
} from "lucide-react";
import GuideCard from "./GuideCard";
import FaqAccordion from "./FaqAccordion";

const guides = [
  {
    icon: ShieldCheck,
    iconColor: "#8A5FC7",
    iconBg: "#EDE4F7",
    title: "Getting verified",
    description: "Step-by-step identity verification guide",
    href: "/verification",
  },
  {
    icon: FileEdit,
    iconColor: "#3E8E5A",
    iconBg: "#DDEEE2",
    title: "Writing winning proposals",
    description: "Tips from top-earning freelancers",
    href: "/help-support/guides/proposals",
  },
  {
    icon: Wallet,
    iconColor: "#DE814A",
    iconBg: "#FBEADB",
    title: "Understanding payments",
    description: "Escrow, fees, and withdrawals",
    href: "/help-support/guides/payments",
  },
  {
    icon: TrendingUp,
    iconColor: "#3E8E5A",
    iconBg: "#DDEEE2",
    title: "Improving your profile score",
    description: "Ranked actions to increase visibility",
    href: "/help-support/guides/profile-score",
  },
  {
    icon: AlertCircle,
    iconColor: "#C6543A",
    iconBg: "#FBEADB",
    title: "Dispute resolution",
    description: "What to do if something goes wrong",
    href: "/help-support/guides/disputes",
  },
  {
    icon: Globe,
    iconColor: "#3E7AC7",
    iconBg: "#DCE9F7",
    title: "Freelancing in Africa",
    description: "Regional tips, payments, and taxes",
    href: "/help-support/guides/freelancing-in-africa",
  },
];

export default function GuidesFaqs() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <GuideCard key={guide.title} {...guide} />
        ))}
      </div>

      <FaqAccordion />
    </div>
  );
}
