import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export async function POST(req: NextRequest) {
  const admin = createAdminClient();
  const { email, token, type } = await req.json();

  if (!email || !token || !type) {
    return NextResponse.json(
      { error: "email, token, and type are required" },
      { status: 400 },
    );
  }

  const windowStart = new Date(
    Date.now() - WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { count } = await admin
    .from("otp_attempts")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("attempted_at", windowStart);

  if ((count ?? 0) >= MAX_ATTEMPTS) {
    return NextResponse.json(
      {
        error: `Too many attempts. Request a new code and try again in ${WINDOW_MINUTES} minutes.`,
      },
      { status: 429 },
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({ email, token, type });

  if (error) {
    await admin.from("otp_attempts").insert({ email, ip });
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
