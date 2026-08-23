import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type MilestoneInput = { title: string; amount: number; dueDate: string | null };

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId, milestones } = (await request.json()) as {
    applicationId: string;
    milestones: MilestoneInput[];
  };

  if (!applicationId || !milestones?.length) {
    return NextResponse.json(
      { error: "Missing application or milestones" },
      { status: 400 },
    );
  }

  const { data: application } = await supabase
    .from("applications")
    .select("id, job_id, freelancer_id, jobs ( employer_id, title )")
    .eq("id", applicationId)
    .single();

  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }

  const job =
    Array.isArray(application.jobs) ? application.jobs[0] : application.jobs;

  if (!job || job.employer_id !== user.id) {
    return NextResponse.json(
      { error: "Not authorized for this job" },
      { status: 403 },
    );
  }

  const { data: existingContract } = await supabase
    .from("contracts")
    .select("id")
    .eq("job_id", application.job_id)
    .eq("freelancer_id", application.freelancer_id)
    .maybeSingle();

  if (existingContract) {
    return NextResponse.json(
      { error: "A contract already exists for this candidate" },
      { status: 409 },
    );
  }

  const { data: contract, error: contractError } = await supabase
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
    console.error("Contract creation failed:", contractError);
    return NextResponse.json(
      { error: "Could not create contract" },
      { status: 500 },
    );
  }

  const { data: insertedMilestones, error: milestoneError } = await supabase
    .from("milestones")
    .insert(
      milestones.map((m) => ({
        contract_id: contract.id,
        title: m.title,
        amount: m.amount,
        due_date: m.dueDate,
        status: "upcoming",
      })),
    )
    .select("id");

  if (milestoneError) {
    console.error("Milestone creation failed:", milestoneError);
    return NextResponse.json(
      { error: "Contract created, but milestones failed to save" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    contractId: contract.id,
    milestoneIds: (insertedMilestones ?? []).map((m) => m.id),
  });
}
