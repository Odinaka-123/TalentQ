import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initiateTransfer } from "@/lib/paystack/client";
import { getAvailableBalance } from "@/lib/paystack/balance";
import { createNotification } from "@/lib/queries/notifications";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount, payoutAccountId } = await request.json();

  if (!amount || amount <= 0 || !payoutAccountId) {
    return NextResponse.json(
      { error: "Missing amount or payout account" },
      { status: 400 },
    );
  }

  // Never trust a client-sent balance — recompute from real transaction history.
  const availableBalance = await getAvailableBalance(supabase, user.id);

  if (amount > availableBalance) {
    return NextResponse.json(
      { error: "Amount exceeds available balance" },
      { status: 400 },
    );
  }

  const { data: account } = await supabase
    .from("payout_accounts")
    .select("recipient_code, bank_name, account_number_last4")
    .eq("id", payoutAccountId)
    .eq("freelancer_id", user.id)
    .single();

  if (!account) {
    return NextResponse.json(
      { error: "Payout account not found" },
      { status: 404 },
    );
  }

  const reference = randomUUID();
  const feeAmount = Math.round(amount * 0.1 * 100) / 100;
  const netAmount = Math.round((amount - feeAmount) * 100) / 100;

  try {
    // Only the net amount actually leaves to the freelancer's bank —
    // the 10% fee (TalentQ + Paystack's cut) is retained, not transferred.
    await initiateTransfer({
      amount: netAmount,
      recipientCode: account.recipient_code,
      reference,
    });

    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "withdrawal",
      gross_amount: amount,
      fee_amount: feeAmount,
      net_amount: netAmount,
      provider: "paystack",
      status: "pending",
      provider_reference: reference,
    });

    if (insertError) {
      console.error("Failed to record withdrawal transaction:", insertError);
      // The transfer already fired on Paystack's side at this point — this is a
      // recording failure, not a payment failure. Surfacing this to the person
      // as a generic error would be misleading since money may already be moving.
      return NextResponse.json(
        {
          error:
            "Withdrawal was sent but couldn't be recorded — contact support with reference " +
            reference,
        },
        { status: 500 },
      );
    }

    await createNotification(supabase, {
      userId: user.id,
      type: "withdrawal_initiated",
      title: "Withdrawal initiated",
      body: `$${netAmount.toFixed(2)} is on its way to ${account.bank_name} · •••• ${account.account_number_last4}.`,
      link: "/payments?tab=history",
    });

    return NextResponse.json({ reference }, { status: 201 });
  } catch (error) {
    console.error("Transfer initiation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Withdrawal failed" },
      { status: 502 },
    );
  }
}
