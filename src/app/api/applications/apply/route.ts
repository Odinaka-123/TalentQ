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

  const { jobId } = await req.json();

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const { data: job, error: jobError } = await admin
    .from("jobs")
    .select("id, title, employer_id")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const { error: insertError } = await admin.from("applications").insert({
    job_id: jobId,
    freelancer_id: user.id,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ alreadyApplied: true });
    }
    return NextResponse.json(
      { error: "Could not submit your application. Try again." },
      { status: 500 },
    );
  }

  const { data: freelancerProfile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  await createNotification(admin, {
    userId: job.employer_id,
    type: "application_submitted",
    title: `${freelancerProfile?.full_name ?? "A freelancer"} applied to "${job.title}"`,
    link: "/employer/candidates",
  });

  return NextResponse.json({ success: true });
}
