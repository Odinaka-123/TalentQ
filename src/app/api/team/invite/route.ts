import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTeamInviteEmail } from "@/lib/email/resend";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: effectiveEmployerId, error: rpcError } = await admin.rpc(
    "get_effective_employer_id",
    { uid: user.id },
  );

  if (rpcError || !effectiveEmployerId) {
    return NextResponse.json(
      { error: "Only employers or active team members can invite" },
      { status: 403 },
    );
  }

  const { email, role } = await req.json();

  if (!email || !role) {
    return NextResponse.json(
      { error: "email and role are required" },
      { status: 400 },
    );
  }

  const { data: existing } = await admin
    .from("team_members")
    .select("id, status")
    .eq("employer_id", effectiveEmployerId)
    .eq("email", email)
    .maybeSingle();

  if (existing?.status === "Active") {
    return NextResponse.json(
      { error: "This person is already on your team." },
      { status: 400 },
    );
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const memberQuery = existing
    ? admin
        .from("team_members")
        .update({
          role,
          status: "Pending",
          invite_token: token,
          invite_token_expires_at: expiresAt,
        })
        .eq("id", existing.id)
        .select()
        .single()
    : admin
        .from("team_members")
        .insert({
          employer_id: effectiveEmployerId,
          email,
          role,
          status: "Pending",
          invite_token: token,
          invite_token_expires_at: expiresAt,
        })
        .select()
        .single();

  const { data: member, error: writeError } = await memberQuery;

  if (writeError || !member) {
    return NextResponse.json(
      { error: writeError?.message ?? "Could not create invite" },
      { status: 500 },
    );
  }

  const { data: employerDetails } = await admin
    .from("employer_details")
    .select("company_name")
    .eq("id", effectiveEmployerId)
    .single();

  const { data: employerProfile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", effectiveEmployerId)
    .single();

  const companyName =
    employerDetails?.company_name ?? employerProfile?.full_name ?? "TalentQ";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const acceptUrl = `${appUrl}/invite/accept?token=${token}`;

  const emailSent = await sendTeamInviteEmail({
    to: email,
    companyName,
    role,
    acceptUrl,
  });

  return NextResponse.json({
    ...member,
    invite_token: undefined,
    invite_token_expires_at: undefined,
    emailSent,
  });
}
