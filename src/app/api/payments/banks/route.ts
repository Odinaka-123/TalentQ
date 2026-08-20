import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listBanks } from "@/lib/paystack/client";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const banks = await listBanks();
    return NextResponse.json({ banks });
  } catch (error) {
    console.error("Bank lookup failed:", error);
    return NextResponse.json(
      { error: "Could not load banks" },
      { status: 502 },
    );
  }
}
