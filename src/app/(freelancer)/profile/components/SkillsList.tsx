type Skill = {
  name: string;
  proficiency: number;
};

const skills: Skill[] = [
  { name: "React", proficiency: 95 },
  { name: "TypeScript", proficiency: 90 },
  { name: "Node.js", proficiency: 85 },
  { name: "PostgreSQL", proficiency: 80 },
  { name: "AWS", proficiency: 75 },
  { name: "GraphQL", proficiency: 88 },
  { name: "Docker", proficiency: 72 },
  { name: "Python", proficiency: 70 },
];

export default function SkillsList() {
  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex flex-col gap-5">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-[#1F2A22]">
                {skill.name}
              </span>
              <span className="text-sm text-[#8A8A7E]">
                {skill.proficiency}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EFEBE2]">
              <div
                className="h-full rounded-full bg-[#A8531E]"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
