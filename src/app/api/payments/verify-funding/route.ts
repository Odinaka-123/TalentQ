import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/paystack/client";
import { createNotification } from "@/lib/queries/notifications";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reference } = await req.json();

  if (!reference) {
    return NextResponse.json(
      { error: "Missing reference" },
      { status: 400 },
    );
  }

  const { data: transaction, error: transactionError } = await admin
    .from("transactions")
    .select("id, user_id, milestone_id, status")
    .eq("provider_reference", reference)
    .single();

  if (transactionError || !transaction) {
    return NextResponse.json(
      { success: false, error: "Transaction not found" },
      { status: 404 },
    );
  }

  if (transaction.user_id !== user.id) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  if (transaction.status === "completed") {
    return NextResponse.json({ success: true });
  }

  try {
    const result = await verifyTransaction(reference);

    if (result.status !== "success") {
      await admin
        .from("transactions")
        .update({ status: "failed" })
        .eq("id", transaction.id);

      return NextResponse.json({ success: false });
    }

    await admin
      .from("transactions")
      .update({ status: "completed" })
      .eq("id", transaction.id);

    await admin
      .from("milestones")
      .update({ status: "pending", funded_at: new Date().toISOString() })
      .eq("id", transaction.milestone_id);

    const { data: milestone } = await admin
      .from("milestones")
      .select("title, contract_id, contracts(employer_id, freelancer_id)")
      .eq("id", transaction.milestone_id)
      .single();

    const contract = milestone
      ? Array.isArray(milestone.contracts)
        ? milestone.contracts[0]
        : milestone.contracts
      : null;

    if (milestone && contract) {
      await createNotification(admin, {
        userId: contract.freelancer_id,
        type: "milestone_funded",
        title: `"${milestone.title}" has been funded`,
        body: "Funds are now held in escrow.",
        link: "/payments",
      });

      await createNotification(admin, {
        userId: contract.employer_id,
        type: "milestone_funded",
        title: `You funded "${milestone.title}"`,
        body: "Funds are now held in escrow.",
        link: "/employer/payments?tab=history",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Verification failed",
      },
      { status: 502 },
    );
  }
}
