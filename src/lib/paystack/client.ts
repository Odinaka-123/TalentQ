const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

async function paystackFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.status) {
    throw new Error(data.message || "Paystack request failed");
  }

  return data;
}

export async function listBanks(): Promise<{ name: string; code: string }[]> {
  const data = await paystackFetch("/bank?country=nigeria&perPage=100");
  return (data.data ?? []).map((b: { name: string; code: string }) => ({
    name: b.name,
    code: b.code,
  }));
}

export async function resolveAccount(accountNumber: string, bankCode: string) {
  const params = new URLSearchParams({
    account_number: accountNumber,
    bank_code: bankCode,
  });
  const data = await paystackFetch(`/bank/resolve?${params.toString()}`);
  return { accountName: data.data.account_name as string };
}

export async function createTransferRecipient(params: {
  name: string;
  accountNumber: string;
  bankCode: string;
}): Promise<string> {
  const data = await paystackFetch("/transferrecipient", {
    method: "POST",
    body: JSON.stringify({
      type: "nuban",
      name: params.name,
      account_number: params.accountNumber,
      bank_code: params.bankCode,
      currency: "NGN",
    }),
  });
  return data.data.recipient_code as string;
}

// Paystack's /transfer endpoint requires a Registered Business — Starter
// businesses get a hard rejection ("You cannot initiate third party payouts
// as a starter business") regardless of test/live mode. Setting
// PAYSTACK_MOCK_TRANSFERS=true in .env.local bypasses the real call so the
// rest of the withdrawal flow (fee math, balance deduction, transaction
// history) can still be built and demoed without a completed business
// verification. Never set this in a real production environment.
export async function initiateTransfer(params: {
  amount: number; // in naira, converted to kobo here
  recipientCode: string;
  reference: string;
  reason?: string;
}) {
  if (process.env.PAYSTACK_MOCK_TRANSFERS === "true") {
    console.warn(
      "[paystack] PAYSTACK_MOCK_TRANSFERS is enabled — skipping real transfer call for reference:",
      params.reference,
    );
    return {
      id: Math.floor(Math.random() * 1_000_000),
      reference: params.reference,
      recipient: params.recipientCode,
      amount: Math.round(params.amount * 100),
      reason: params.reason ?? "TalentQ withdrawal",
      status: "success",
      currency: "NGN",
      source: "balance",
    };
  }

  const data = await paystackFetch("/transfer", {
    method: "POST",
    body: JSON.stringify({
      source: "balance",
      amount: Math.round(params.amount * 100),
      recipient: params.recipientCode,
      reference: params.reference,
      reason: params.reason ?? "TalentQ withdrawal",
    }),
  });
  return data.data;
}
