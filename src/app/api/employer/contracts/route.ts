import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/queries/notifications";

type MilestoneInput = {
  title: string;
  amount: number;
  dueDate: string | null;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId, milestones } = (await req.json()) as {
    applicationId?: string;
    milestones?: MilestoneInput[];
  };

  if (!applicationId || !milestones || milestones.length === 0) {
    return NextResponse.json(
      { error: "applicationId and at least one milestone are required" },
      { status: 400 },
    );
  }

  for (const m of milestones) {
    if (!m.title?.trim() || !(Number(m.amount) > 0)) {
      return NextResponse.json(
        { error: "Each milestone needs a title and an amount greater than 0" },
        { status: 400 },
      );
    }
  }

  const { data: application, error: applicationError } = await admin
    .from("applications")
    .select("id, job_id, freelancer_id, jobs(employer_id)")
    .eq("id", applicationId)
    .single();

  if (applicationError || !application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }

  const job = Array.isArray(application.jobs)
    ? application.jobs[0]
    : application.jobs;

  if (!job || job.employer_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: contract, error: contractError } = await admin
    .from("contracts")
    .insert({
      job_id: application.job_id,
      employer_id: user.id,
      freelancer_id: application.freelancer_id,
      status: "active",
    })
    .select("id")
    .single();

  if (contractError || !contract) {
    return NextResponse.json(
      { error: contractError?.message ?? "Failed to create contract" },
      { status: 500 },
    );
  }

  const { data: createdMilestones, error: milestonesError } = await admin
    .from("milestones")
    .insert(
      milestones.map((m) => ({
        contract_id: contract.id,
        title: m.title.trim(),
        amount: m.amount,
        due_date: m.dueDate,
        status: "upcoming",
      })),
    )
    .select("id");

  if (milestonesError || !createdMilestones) {
    return NextResponse.json(
      { error: milestonesError?.message ?? "Failed to create milestones" },
      { status: 500 },
    );
  }

  const { data: employerProfile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: freelancerProfile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", application.freelancer_id)
    .single();

  await createNotification(admin, {
    userId: application.freelancer_id,
    type: "contract_created",
    title: `${employerProfile?.full_name ?? "An employer"} created a contract with you`,
    body: `${milestones.length} milestone${milestones.length > 1 ? "s" : ""} added`,
    link: "/messages",
  });

  await createNotification(admin, {
    userId: user.id,
    type: "contract_created",
    title: `Contract created with ${freelancerProfile?.full_name ?? "freelancer"}`,
    body: `${milestones.length} milestone${milestones.length > 1 ? "s" : ""} added`,
    link: "/employer/payments?tab=fund-milestone",
  });

  return NextResponse.json({
    contractId: contract.id,
    milestoneIds: createdMilestones.map((m) => m.id),
  });
}
