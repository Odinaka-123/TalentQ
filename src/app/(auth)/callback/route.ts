import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = searchParams.get("role");

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // For new Google sign-ups, set role if it wasn't already set
    if (role && data.user) {
      await supabase
        .from("profiles")
        .update({ role })
        .eq("id", data.user.id)
        .is("role", null);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    return NextResponse.redirect(
      `${origin}${profile?.role === "employer" ? "/employer/dashboard" : "/dashboard"}`,
    );
  }

  return NextResponse.redirect(`${origin}/login`);
}
