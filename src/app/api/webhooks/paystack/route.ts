import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

function verifySignature(payload: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha512", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";

  if (!verifySignature(rawBody, signature, process.env.PAYSTACK_SECRET_KEY!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const reference = event.data?.reference as string | undefined;

  if (!reference) {
    return NextResponse.json({ received: true }); // nothing to match, ack anyway
  }

  const mappedStatus =
    event.event === "transfer.success" ? "completed"
    : event.event === "transfer.failed" || event.event === "transfer.reversed" ?
      "failed"
    : null;

  if (mappedStatus) {
    const supabase = createAdminClient();
    await supabase
      .from("transactions")
      .update({ status: mappedStatus })
      .eq("provider_reference", reference)
      .eq("status", "pending"); // idempotent — only touch it once
  }

  return NextResponse.json({ received: true });
}
