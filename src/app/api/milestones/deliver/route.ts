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

  const { milestoneId } = await req.json();

  if (!milestoneId) {
    return NextResponse.json(
      { error: "milestoneId is required" },
      { status: 400 },
    );
  }

  const { data: milestone, error: milestoneError } = await admin
    .from("milestones")
    .select("id, title, status, contracts(employer_id, freelancer_id)")
    .eq("id", milestoneId)
    .single();

  if (milestoneError || !milestone) {
    return NextResponse.json(
      { error: "Milestone not found" },
      { status: 404 },
    );
  }

  const contract = Array.isArray(milestone.contracts)
    ? milestone.contracts[0]
    : milestone.contracts;

  if (!contract || contract.freelancer_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (milestone.status !== "pending") {
    return NextResponse.json(
      { error: "This milestone isn't awaiting delivery" },
      { status: 400 },
    );
  }

  const { error: updateError } = await admin
    .from("milestones")
    .update({ status: "delivered", delivered_at: new Date().toISOString() })
    .eq("id", milestoneId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data: freelancerProfile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  await createNotification(admin, {
    userId: contract.employer_id,
    type: "milestone_delivered",
    title: `${freelancerProfile?.full_name ?? "Your freelancer"} delivered "${milestone.title}"`,
    body: "Review the work and release the funds when you're ready.",
    link: "/employer/payments?tab=history",
  });

  await createNotification(admin, {
    userId: user.id,
    type: "milestone_delivered",
    title: `You marked "${milestone.title}" as delivered`,
    body: "The client has been notified to review your work.",
    link: "/payments",
  });

  return NextResponse.json({ status: "delivered" });
}
