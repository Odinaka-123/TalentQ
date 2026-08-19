import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const diditRes = await fetch("https://verification.didit.me/v3/session/", {
    method: "POST",
    headers: {
      "x-api-key": process.env.DIDIT_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workflow_id: process.env.DIDIT_WORKFLOW_ID, // set this once you configure a workflow in the Didit dashboard
      vendor_data: userId, // lets us match the webhook callback back to this user
    }),
  });

  if (!diditRes.ok) {
    const errText = await diditRes.text();
    console.error("Didit session creation failed:", errText);
    return NextResponse.json(
      { error: "Didit session failed" },
      { status: 500 },
    );
  }

  const session = await diditRes.json();

  // Record the pending submission now, so it exists even before the webhook fires
  const supabase = await createClient();
  await supabase.from("verification_submissions").insert({
    user_id: userId,
    method: "didit",
    status: "pending",
    submitted_data: { session_id: session.session_id },
  });
  await supabase
    .from("profiles")
    .update({ identity_verification_status: "pending" })
    .eq("id", userId);

  return NextResponse.json({ sessionUrl: session.url });
}
