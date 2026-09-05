import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // contracts carry financial history (milestones, transactions) and have
  // no cascade rule from profiles — deleting the auth user while contracts
  // exist would either throw a raw FK violation or, if that constraint
  // changes later, silently wipe financial records. Block explicitly
  // instead, with a clear reason, rather than letting either happen.
  const { count, error: contractsError } = await admin
    .from("contracts")
    .select("id", { count: "exact", head: true })
    .eq("employer_id", user.id);

  if (contractsError) {
    return NextResponse.json(
      { error: "Couldn't verify account status" },
      { status: 500 },
    );
  }

  if (count && count > 0) {
    return NextResponse.json(
      {
        error:
          "Your account has contract history and can't be deleted automatically. Contact support to close your account.",
      },
      { status: 400 },
    );
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
