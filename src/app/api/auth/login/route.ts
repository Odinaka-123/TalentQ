import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export async function POST(req: NextRequest) {
  const admin = createAdminClient();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const windowStart = new Date(
    Date.now() - WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { count } = await admin
    .from("login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("attempted_at", windowStart);

  if ((count ?? 0) >= MAX_ATTEMPTS) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Try again in ${WINDOW_MINUTES} minutes.`,
      },
      { status: 429 },
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    await admin.from("login_attempts").insert({ email, ip });
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", data.user.id)
    .single();

  return NextResponse.json({
    role: profile?.role ?? null,
    onboardingCompleted: profile?.onboarding_completed ?? false,
  });
}
