import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/paystack/client";

export async function POST(req: NextRequest) {
  const { reference } = await req.json();
  const admin = createAdminClient();

  try {
    const result = await verifyTransaction(reference);

    if (result.status !== "success") {
      await admin
        .from("transactions")
        .update({ status: "failed" })
        .eq("provider_reference", reference);
      return NextResponse.json({ success: false });
    }

    const { data: txn } = await admin
      .from("transactions")
      .select("milestone_id")
      .eq("provider_reference", reference)
      .single();

    if (!txn) return NextResponse.json({ success: false });

    await admin
      .from("transactions")
      .update({ status: "completed" })
      .eq("provider_reference", reference);

    await admin
      .from("milestones")
      .update({ status: "pending", funded_at: new Date().toISOString() })
      .eq("id", txn.milestone_id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
