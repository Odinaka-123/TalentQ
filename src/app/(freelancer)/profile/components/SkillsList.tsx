type SkillsListProps = {
  skills: string[];
};

export default function SkillsList({ skills }: SkillsListProps) {
  if (skills.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        No skills added yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-[#FBEADB] px-3 py-1.5 text-sm text-[#DE814A]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
