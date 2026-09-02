import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { initializeTransaction } from "@/lib/paystack/client";

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

  const { data: milestone, error: milestoneError } = await admin
    .from("milestones")
    .select("id, title, amount, status, contract_id, contracts(employer_id)")
    .eq("id", milestoneId)
    .single();

  if (milestoneError || !milestone) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
  }

  const contract =
    Array.isArray(milestone.contracts) ?
      milestone.contracts[0]
    : milestone.contracts;

  if (!contract || contract.employer_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (milestone.status !== "upcoming") {
    return NextResponse.json(
      { error: "This milestone has already been funded" },
      { status: 400 },
    );
  }

  const reference = randomUUID();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  try {
    const transaction = await initializeTransaction({
      email: user.email!,
      amount: Math.round(Number(milestone.amount) * 100),
      reference,
      callbackUrl: `${appUrl}/employer/payments/fund-callback`,
      metadata: { milestoneId: milestone.id, employerId: user.id },
    });

    await admin.from("transactions").insert({
      user_id: user.id,
      milestone_id: milestone.id,
      type: "escrow_fund",
      gross_amount: milestone.amount,
      fee_amount: 0,
      net_amount: milestone.amount,
      provider: "paystack",
      status: "pending",
      provider_reference: reference,
    });

    return NextResponse.json({
      authorizationUrl: transaction.authorization_url,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to start payment" },
      { status: 502 },
    );
  }
}
