import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/queries/notifications";

const ADVANCE_MAP: Record<string, string> = {
  invited: "interviewing",
  interviewing: "offer_sent",
  offer_sent: "hired",
};

const FREELANCER_MESSAGE: Record<string, (job: string) => string> = {
  interviewing: (job) => `You've been moved to the interview stage for "${job}"`,
  offer_sent: (job) => `You received an offer for "${job}"`,
  hired: (job) => `You were hired for "${job}"`,
  rejected: (job) => `An update on your application for "${job}"`,
};

const EMPLOYER_MESSAGE: Record<string, (name: string) => string> = {
  interviewing: (name) => `You moved ${name} to interviewing`,
  offer_sent: (name) => `You sent an offer to ${name}`,
  hired: (name) => `You hired ${name}`,
  rejected: (name) => `You passed on ${name}`,
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

  const { applicationId, action } = await req.json();

  if (!applicationId || !["advance", "reject"].includes(action)) {
    return NextResponse.json(
      { error: "applicationId and a valid action are required" },
      { status: 400 },
    );
  }

  const { data: application, error: applicationError } = await admin
    .from("applications")
    .select("id, freelancer_id, status, jobs(employer_id, title)")
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

  if (application.status === "hired" || application.status === "rejected") {
    return NextResponse.json(
      { error: "This application is already closed out" },
      { status: 400 },
    );
  }

  let newStatus: string;

  if (action === "reject") {
    newStatus = "rejected";
  } else {
    const next = ADVANCE_MAP[application.status];
    if (!next) {
      return NextResponse.json(
        { error: "This application can't be advanced from its current stage" },
        { status: 400 },
      );
    }
    newStatus = next;
  }

  const { error: updateError } = await admin
    .from("applications")
    .update({ status: newStatus })
    .eq("id", applicationId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const [{ data: employerProfile }, { data: freelancerProfile }] =
    await Promise.all([
      admin.from("profiles").select("full_name").eq("id", user.id).single(),
      admin
        .from("profiles")
        .select("full_name")
        .eq("id", application.freelancer_id)
        .single(),
    ]);

  await createNotification(admin, {
    userId: application.freelancer_id,
    type: `application_${newStatus}`,
    title: FREELANCER_MESSAGE[newStatus]?.(job.title ?? "a role") ?? "Application updated",
    link: "/find-jobs",
  });

  await createNotification(admin, {
    userId: user.id,
    type: `application_${newStatus}`,
    title:
      EMPLOYER_MESSAGE[newStatus]?.(freelancerProfile?.full_name ?? "the candidate") ??
      "Application updated",
    link: "/employer/candidates",
  });

  return NextResponse.json({ status: newStatus });
}
