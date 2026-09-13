type JobDetailsData = {
  title: string;
  jobType: string;
  workArrangement: string;
  department: string;
  description: string;
};

type RequirementsData = {
  experienceLevel: string;
  yearsOfExperience: string;
  skills: string[];
  preferredQualifications: string;
};

type CompensationData = {
  currency: string;
  minBudget: string;
  maxBudget: string;
  experienceLevel: string;
  projectDuration: string;
  paymentType: string;
  applicationDeadline: string;
};

export async function createJob(
  employerId: string,
  jobDetails: JobDetailsData,
  requirements: RequirementsData,
  compensation: CompensationData,
) {
  // employerId is no longer sent — the API route derives the employer from
  // the authenticated session server-side, since a client-supplied id can't
  // be trusted. Kept as a parameter so callers (post-job/page.tsx) don't
  // need to change.
  void employerId;

  try {
    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDetails, requirements, compensation }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error ?? "Failed to create job", jobId: null };
    }

    return { error: null, jobId: data.jobId as string };
  } catch {
    return { error: "Failed to create job", jobId: null };
  }
}
