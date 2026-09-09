import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function loadInvite(admin: ReturnType<typeof createAdminClient>, token: string) {
  const { data: invite } = await admin
    .from("team_members")
    .select("id, employer_id, email, role, status, invite_token_expires_at")
    .eq("invite_token", token)
    .maybeSingle();

  if (!invite) return { error: "This invite link is invalid." };
  if (invite.status !== "Pending") return { error: "This invite has already been used." };
  if (
    invite.invite_token_expires_at &&
    new Date(invite.invite_token_expires_at) < new Date()
  ) {
    return { error: "This invite has expired." };
  }

  return { invite };
}

export async function GET(req: NextRequest) {
  const admin = createAdminClient();
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false, error: "Missing token" });
  }

  const result = await loadInvite(admin, token);
  if ("error" in result) {
    return NextResponse.json({ valid: false, error: result.error });
  }

  const { data: employerDetails } = await admin
    .from("employer_details")
    .select("company_name")
    .eq("id", result.invite.employer_id)
    .single();

  const { data: employerProfile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", result.invite.employer_id)
    .single();

  return NextResponse.json({
    valid: true,
    email: result.invite.email,
    role: result.invite.role,
    companyName:
      employerDetails?.company_name ?? employerProfile?.full_name ?? "TalentQ",
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const result = await loadInvite(admin, token);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (result.invite.email.toLowerCase() !== (user.email ?? "").toLowerCase()) {
    return NextResponse.json(
      {
        error: `This invite was sent to ${result.invite.email}, but you're signed in as ${user.email}.`,
      },
      { status: 403 },
    );
  }

  const { error: updateMemberError } = await admin
    .from("team_members")
    .update({
      user_id: user.id,
      status: "Active",
      joined_at: new Date().toISOString(),
      invite_token: null,
      invite_token_expires_at: null,
    })
    .eq("id", result.invite.id);

  if (updateMemberError) {
    return NextResponse.json({ error: updateMemberError.message }, { status: 500 });
  }

  // Joining an existing employer's team, not creating a new company —
  // skip the normal "set up your company" onboarding entirely.
  await admin
    .from("profiles")
    .update({ role: "employer", onboarding_completed: true })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
