import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/queries/notifications";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId } = await req.json();

  if (!applicationId) {
    return NextResponse.json(
      { error: "applicationId is required" },
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

  if (application.status !== "applied") {
    return NextResponse.json(
      { error: "This candidate has already been invited" },
      { status: 400 },
    );
  }

  const { error: updateError } = await admin
    .from("applications")
    .update({ status: "invited" })
    .eq("id", applicationId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 },
    );
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
    type: "invited",
    title: `${employerProfile?.full_name ?? "An employer"} invited you to interview`,
    body: job.title ? `For ${job.title}` : undefined,
    link: "/find-jobs",
  });

  await createNotification(admin, {
    userId: user.id,
    type: "invited",
    title: `You invited ${freelancerProfile?.full_name ?? "the candidate"} to interview`,
    body: job.title ? `For ${job.title}` : undefined,
    link: "/employer/candidates",
  });

  return NextResponse.json({ status: "Invited" });
}
