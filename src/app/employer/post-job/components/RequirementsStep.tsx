import SkillSelector from "@/components/SkillSelector/SkillSelector";

type RequirementsData = {
  experienceLevel: string;
  yearsOfExperience: string;
  skills: string[];
  preferredQualifications: string;
};

type RequirementsStepProps = {
  data: RequirementsData;
  onChange: (data: RequirementsData) => void;
};

const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead / Principal",
];

export default function RequirementsStep({
  data,
  onChange,
}: RequirementsStepProps) {
  const update = <K extends keyof RequirementsData>(
    key: K,
    value: RequirementsData[K],
  ) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <h2 className="text-base font-semibold text-[#1F2A22] mb-5">
        Requirements
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Experience Level
          </label>
          <select
            value={data.experienceLevel}
            onChange={(e) => update("experienceLevel", e.target.value)}
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] bg-white"
          >
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Years of Experience
          </label>
          <input
            type="text"
            value={data.yearsOfExperience}
            onChange={(e) => update("yearsOfExperience", e.target.value)}
            placeholder="e.g. 3+"
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
          Required Skills
        </label>
        <SkillSelector
          selected={data.skills}
          onChange={(skills) => update("skills", skills)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
          Preferred Qualifications
        </label>
        <textarea
          value={data.preferredQualifications}
          onChange={(e) => update("preferredQualifications", e.target.value)}
          placeholder="Mention any preferred certifications or background"
          rows={4}
          className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] resize-none"
        />
      </div>
    </div>
  );
}
