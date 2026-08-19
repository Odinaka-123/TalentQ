import GuideCard from "./GuideCard";
import FaqAccordion from "./FaqAccordion";

const guides = [
  {
    title: "Getting verified",
    description: "Step-by-step verification guide",
    href: "/employer/verification",
  },
  {
    title: "Writing winning proposals",
    description: "Tips from top-earning freelancers",
    href: "/employer/help-support/guides/proposals",
  },
  {
    title: "Understanding payments",
    description: "Escrow, fees, and withdrawals",
    href: "/employer/help-support/guides/payments",
  },
  {
    title: "Improving your profile score",
    description: "Ranked actions to increase visibility",
    href: "/employer/help-support/guides/profile-score",
  },
  {
    title: "Dispute resolution",
    description: "What to do if something goes wrong",
    href: "/employer/help-support/guides/disputes",
  },
  {
    title: "Freelancing in Africa",
    description: "Regional tips, payments, and taxes",
    href: "/employer/help-support/guides/freelancing-in-africa",
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
