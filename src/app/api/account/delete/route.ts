import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeError, safeError } from "@/lib/api/sanitizeError";

export async function POST() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return safeError("Unauthorized", 401);
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
    return sanitizeError(contractsError, "account/delete:contracts-check");
  }

  if (count && count > 0) {
    return safeError(
      "Your account has contract history and can't be deleted automatically. Contact support to close your account.",
    );
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return sanitizeError(error, "account/delete:deleteUser");
  }

  return NextResponse.json({ success: true });
}
