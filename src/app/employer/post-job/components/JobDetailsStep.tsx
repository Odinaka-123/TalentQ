"use client";

type JobDetailsData = {
  title: string;
  jobType: string;
  workArrangement: string;
  department: string;
  description: string;
};

type JobDetailsStepProps = {
  data: JobDetailsData;
  onChange: (data: JobDetailsData) => void;
};

const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"];
const workArrangements = ["Remote", "Hybrid", "On-site"];

export default function JobDetailsStep({
  data,
  onChange,
}: JobDetailsStepProps) {
  const update = (key: keyof JobDetailsData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <h2 className="text-base font-semibold text-[#1F2A22] mb-5">
        Job Details
      </h2>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
              Job Type
            </label>
            <select
              value={data.jobType}
              onChange={(e) => update("jobType", e.target.value)}
              className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] bg-white"
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
              Work Arrangement
            </label>
            <select
              value={data.workArrangement}
              onChange={(e) => update("workArrangement", e.target.value)}
              className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] bg-white"
            >
              {workArrangements.map((arrangement) => (
                <option key={arrangement} value={arrangement}>
                  {arrangement}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Department / Team
          </label>
          <input
            type="text"
            value={data.department}
            onChange={(e) => update("department", e.target.value)}
            placeholder="e.g. Engineering, Design, Marketing"
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Job Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe the role, responsibilities, and what a typical day looks like..."
            rows={5}
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
