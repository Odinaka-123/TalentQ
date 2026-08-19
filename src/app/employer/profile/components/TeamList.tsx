import TeamMemberRow from "./TeamMemberRow";

const team = [
  {
    initials: "SM",
    avatarColor: "#3E7AC7",
    name: "Sarah Mensah",
    role: "Hiring Manager",
    status: "Active" as const,
  },
  {
    initials: "JO",
    avatarColor: "#3E8E5A",
    name: "James Oduya",
    role: "CTO",
    status: "Active" as const,
  },
  {
    initials: "PN",
    avatarColor: "#DE814A",
    name: "Priya Nair",
    role: "Product Lead",
    status: "Active" as const,
  },
];

export default function TeamList() {
  return (
    <div className="rounded-2xl bg-white px-6 py-2 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {team.map((member) => (
          <TeamMemberRow key={member.name} {...member} />
        ))}
      </div>
    </div>
  );
}
