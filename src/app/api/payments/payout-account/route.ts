import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTransferRecipient } from "@/lib/paystack/client";
import { getAvailableBalance } from "@/lib/paystack/balance";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: accounts, error }, availableBalance] = await Promise.all([
    supabase
      .from("payout_accounts")
      .select(
        "id, bank_name, bank_code, account_name, account_number_last4, is_default, created_at",
      )
      .eq("freelancer_id", user.id)
      .order("created_at", { ascending: false }),
    getAvailableBalance(supabase, user.id),
  ]);

  if (error) {
    return NextResponse.json(
      { error: "Could not load payout accounts" },
      { status: 500 },
    );
  }

  return NextResponse.json({ accounts: accounts ?? [], availableBalance });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accountNumber, bankCode, bankName, accountName, isDefault } =
    await request.json();

  if (!accountNumber || !bankCode || !bankName || !accountName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const recipientCode = await createTransferRecipient({
      name: accountName,
      accountNumber,
      bankCode,
    });

    // Insert first, before touching any existing default — if this fails,
    // the freelancer's current default account is left untouched instead
    // of ending up with zero default accounts.
    const { data: account, error: insertError } = await supabase
      .from("payout_accounts")
      .insert({
        freelancer_id: user.id,
        provider: "paystack",
        bank_code: bankCode,
        bank_name: bankName,
        account_name: accountName,
        account_number_last4: accountNumber.slice(-4),
        recipient_code: recipientCode,
        is_default: isDefault ?? true,
      })
      .select("id, bank_name, account_name, account_number_last4, is_default")
      .single();

    if (insertError) {
      console.error("Payout account insert failed:", insertError);
      return NextResponse.json(
        { error: "Could not save payout account" },
        { status: 500 },
      );
    }

    // Only now clear the old default — excluding the row we just inserted,
    // since it may already be the new default from the insert above.
    if (isDefault) {
      await supabase
        .from("payout_accounts")
        .update({ is_default: false })
        .eq("freelancer_id", user.id)
        .neq("id", account.id);
    }

    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error("Recipient creation failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ?
            error.message
          : "Could not connect bank account",
      },
      { status: 502 },
    );
  }
}
