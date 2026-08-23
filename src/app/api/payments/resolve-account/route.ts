import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveAccount } from "@/lib/paystack/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accountNumber, bankCode } = await request.json();

  if (!accountNumber || !bankCode) {
    return NextResponse.json(
      { error: "Missing account number or bank" },
      { status: 400 },
    );
  }

  if (!/^\d{10}$/.test(accountNumber)) {
    return NextResponse.json(
      { error: "Account number must be 10 digits" },
      { status: 400 },
    );
  }

  try {
    const result = await resolveAccount({ accountNumber, bankCode });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not verify account",
      },
      { status: 400 },
    );
  }
}
