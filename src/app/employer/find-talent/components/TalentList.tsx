import TalentCard from "./TalentCard";

const talents = [
  {
    href: "/employer/candidates/henrieta-ebiuwa",
    matchScore: 94,
    name: "Henrieta Ebiuwa",
    status: "Available" as const,
    location: "Lagos Nigeria",
    availability: "6+ months",
    proposals: 12,
    skills: ["Typescript", "Node.js", "React", "GraphQL"],
    rate: "$45",
    rateUnit: "h",
    level: "Expert" as const,
  },
  {
    href: "/employer/candidates/chidi-okonkwo",
    matchScore: 87,
    name: "Chidi Okonkwo",
    status: "Available" as const,
    location: "Nigeria",
    availability: "5h ago",
    proposals: 7,
    skills: ["Prototyping", "User Research", "Figma"],
    rate: "$38",
    rateUnit: "hr",
    level: "Intermediate" as const,
  },
  {
    href: "/employer/candidates/fatima-zahra",
    matchScore: 79,
    name: "Fatima Zahra",
    status: "Available" as const,
    location: "Morocco",
    availability: "Ongoing",
    proposals: 21,
    skills: ["Content Writing", "Research", "SEO"],
    rate: "$300-500",
    rateUnit: "",
    level: "Beginner" as const,
  },
];

export default function TalentList() {
  return (
    <div className="flex flex-col gap-4">
      {talents.map((talent) => (
        <TalentCard key={talent.href} {...talent} />
      ))}
    </div>
  );
}
