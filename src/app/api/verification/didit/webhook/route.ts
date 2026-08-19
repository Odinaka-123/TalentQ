import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

function verifySignature(payload: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, signature, process.env.DIDIT_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const userId = event.vendor_data as string;
  const decision = event.status; // e.g. "Approved" | "Declined" | "In Review"

  const supabase = await createClient();

  const mappedStatus =
    decision === "Approved" ? "verified"
    : decision === "Declined" ? "rejected"
    : "pending";

  await supabase
    .from("verification_submissions")
    .update({ status: mappedStatus, submitted_data: event })
    .eq("user_id", userId)
    .eq("method", "didit")
    .eq("status", "pending");

  await supabase
    .from("profiles")
    .update({
      identity_verification_status: mappedStatus,
      identity_verified: mappedStatus === "verified",
    })
    .eq("id", userId);

  return NextResponse.json({ received: true });
}
