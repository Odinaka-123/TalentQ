import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: submission } = await supabase
    .from("verification_submissions")
    .select("id, submitted_data")
    .eq("user_id", userId)
    .eq("method", "didit")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const sessionId = (
    submission?.submitted_data as { session_id?: string } | null
  )?.session_id;

  if (!sessionId) {
    return NextResponse.json(
      { error: "No pending Didit session found" },
      { status: 404 },
    );
  }

  const diditRes = await fetch(
    `https://verification.didit.me/v3/session/${sessionId}/decision/`,
    {
      headers: { "x-api-key": process.env.DIDIT_API_KEY! },
    },
  );

  if (!diditRes.ok) {
    const errText = await diditRes.text();
    console.error("Didit status check failed:", errText);
    return NextResponse.json(
      { error: "Failed to fetch session status" },
      { status: 500 },
    );
  }

  const session = await diditRes.json();
  const decision = session.status as string;

  const mappedStatus =
    decision === "Approved" ? "verified"
    : decision === "Declined" ? "rejected"
    : "pending";

  await supabase
    .from("verification_submissions")
    .update({ status: mappedStatus, submitted_data: session })
    .eq("id", submission!.id);

  await supabase
    .from("profiles")
    .update({
      identity_verification_status: mappedStatus,
      identity_verified: mappedStatus === "verified",
    })
    .eq("id", userId);

  return NextResponse.json({ status: mappedStatus, raw: session });
}
